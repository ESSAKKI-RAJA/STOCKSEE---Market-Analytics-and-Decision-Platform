import urllib.request
import re

try:
    print("Fetching https://stocksee-delta.vercel.app")
    html = urllib.request.urlopen("https://stocksee-delta.vercel.app").read().decode("utf-8")
    scripts = re.findall(r'src=\"(.*?\.js)\"', html)
    print("Found scripts:", scripts)
    for s in scripts:
        url = "https://stocksee-delta.vercel.app" + (s if s.startswith("/") else "/" + s)
        print("Fetching", url)
        js = urllib.request.urlopen(url).read().decode("utf-8")
        match = re.search(r'https://[^\"\']+\.onrender\.com', js)
        if match:
            print("Found Render URL in JS:", match.group(0))
except Exception as e:
    print("Error:", e)
