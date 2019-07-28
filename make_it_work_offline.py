import requests
import zipfile
import os

"""This script will install mathjax locally

After running it, change index.html to include the local version of mathjax.
"""

# xxxxxxxxxxxxxxx Download Mathjax xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
mathjax_version = "2.7.5"
url = f"https://github.com/mathjax/MathJax/archive/{mathjax_version}.zip"
r = requests.request("GET", url)

zip_filename = f"mathjax_{mathjax_version}.zip"
with open(zip_filename, "wb") as fid:
    fid.write(r.content)
# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


# xxxxxxxxxxxxxxx Unzip the file xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Mathjax will be put in the js folder
with zipfile.ZipFile(zip_filename, 'r') as zip_ref:
    zip_ref.extractall("js/")
os.rename(f"js/MathJax-{mathjax_version}", "js/MathJax")
os.remove(f"mathjax_{mathjax_version}.zip")
# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
