# Security Policy

At STOCKSEE, we take security very seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

## Supported Versions

Currently, the following versions are being actively maintained with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| 0.1.x   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within STOCKSEE, please send an e-mail to security@stocksee.io. All security vulnerabilities will be promptly addressed.

Please do **not** report security vulnerabilities via public GitHub issues.

### Responsible Disclosure

- We will acknowledge receipt of your vulnerability report within 48 hours.
- We will provide an estimated timeline for the fix.
- We request that you maintain confidentiality until the fix is deployed and publicly announced.

## Security Practices

We follow enterprise-grade security practices including, but not limited to:

1. **Authentication:** All authentication is delegated to **Clerk**. We do not store passwords, hashes, or sensitive PII directly on our backend.
2. **JWT Verification:** Our FastAPI backend intercepts Authorization headers and securely verifies the JWT against Clerk's remote JWKS endpoints using RSA256 signature verification.
3. **Secrets Management:** We use strict `.env` segregation. Frontend secrets (`VITE_CLERK_PUBLISHABLE_KEY`) are isolated from Backend secrets (`CLERK_SECRET_KEY`).
4. **Dependency Scanning:** We use GitHub Dependabot to scan and automatically patch dependencies in both the `npm` and `pip` ecosystems.
5. **Rate Limiting:** FastAPI endpoints are protected by rate limiters to prevent DoS attacks on external intelligence engines (like Finnhub or yfinance).
6. **Security Headers:** We implement strict CORS policies and enforce OWASP-recommended security headers (HSTS, X-Content-Type-Options, etc.).
