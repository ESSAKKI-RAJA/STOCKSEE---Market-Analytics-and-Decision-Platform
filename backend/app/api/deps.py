from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User, UserPreference
import requests
import jwt
from cachetools import cached, TTLCache

# Cache the JWKS for 1 hour to avoid hitting Clerk API on every request
@cached(cache=TTLCache(maxsize=1, ttl=3600))
def get_clerk_jwks():
    headers = {"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"}
    response = requests.get("https://api.clerk.com/v1/jwks", headers=headers)
    response.raise_for_status()
    return response.json()

def get_token_from_request(request: Request) -> str:
    # First check Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
        
    # Fallback to session cookie
    token = request.cookies.get("__session")
    if token:
        return token
        
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )

def verify_clerk_token(token: str) -> dict:
    try:
        # Get the unverified header to find the kid (Key ID)
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        if not kid:
            raise JWTError("Invalid token header")

        # Fetch JWKS and find the matching public key
        jwks = get_clerk_jwks()
        rsa_key = {}
        for key in jwks.get("keys", []):
            if key["kid"] == kid:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break
                
        if not rsa_key:
            raise Exception("Unable to find appropriate key")

        # Verify the token
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(rsa_key)
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            options={"verify_aud": False} # Or specify audience if needed
        )
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
        )

def get_current_user(db: Session = Depends(get_db), token: str = Depends(get_token_from_request)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    
    # Verify token
    payload = verify_clerk_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise credentials_exception
        
    # Check if user exists in our DB
    user = db.query(User).filter(User.id == user_id).first()
    
    # Automatic User Creation (first login)
    if not user:
        email = payload.get("email_addresses", [""])[0] if "email_addresses" in payload else ""
        # Sometimes clerk JWT only has basic info, we might need to fallback or fetch from API.
        # But for now, just creating a base record is sufficient for relations.
        user = User(
            id=user_id,
            email=email or f"{user_id}@placeholder.com",
            full_name=payload.get("first_name", "") + " " + payload.get("last_name", "")
        )
        db.add(user)
        
        # Create default preferences
        prefs = UserPreference(
            user_id=user_id,
            theme="dark",
            default_view="dashboard",
            risk_tolerance="moderate"
        )
        db.add(prefs)
        
        db.commit()
        db.refresh(user)
        
    return user
