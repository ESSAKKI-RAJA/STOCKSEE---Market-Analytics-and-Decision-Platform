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
        
        # Look for the string surrounding the API requests
        match = re.search(r'(.{0,50})\/api\/report(.{0,50})', js)
        if match:
            print("Found API reference context:", match.group(0))
            
except Exception as e:
    print("Error:", e)
