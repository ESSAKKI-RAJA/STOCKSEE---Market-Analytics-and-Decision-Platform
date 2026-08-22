import urllib.request
import re

try:
    print("Fetching https://stocksee-delta.vercel.app")
    html = urllib.request.urlopen("https://stocksee-delta.vercel.app").read().decode("utf-8")
    scripts = re.findall(r'src=\"(.*?\.js)\"', html)
    for s in scripts:
        url = "https://stocksee-delta.vercel.app" + (s if s.startswith("/") else "/" + s)
        print("Fetching", url)
        js = urllib.request.urlopen(url).read().decode("utf-8")
        
        # Look for the default localhost or anything that looks like an API base url assigned in apiClient.ts
        match = re.search(r'\"http://127\.0\.0\.1:8000\"', js)
        if match:
            print("Found fallback localhost URL:", match.group(0))
        
        # Look for any onrender or other URLs
        match2 = re.findall(r'\"https://[^\"]+\"', js)
        for m in match2:
            if "clerk" not in m and "w3.org" not in m and "react" not in m:
                print("Found potential URL:", m)
except Exception as e:
    print("Error:", e)
