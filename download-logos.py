#!/usr/bin/env python3
"""
Script to download LinkedIn company logos and save them locally.
This avoids the need to manually update expired LinkedIn URLs.

Usage: python download-logos.py
"""

import urllib.request
import sys
import os

# Define logo URLs and filenames
LOGOS = [
    {
        "url": "https://media.licdn.com/dms/image/v2/C510BAQFCGqEmSwrc4w/company-logo_100_100/company-logo_100_100/0/1631338994369?e=1767225600&v=beta&t=jFzx7PWKGuI35R4ntsdcxLIozGENnOwTNF4_P3JB1QA",
        "filename": "caltech_logo.png"
    },
    {
        "url": "https://media.licdn.com/dms/image/v2/C4E0BAQH-sXOOSUF3aA/company-logo_100_100/company-logo_100_100/0/1631319371681?e=1767225600&v=beta&t=3wWunjJgU2Nin4whX5I-J5YFYxMLjxXrTvFV5xKtquc",
        "filename": "northwestern_logo.png"
    },
    {
        "url": "https://media.licdn.com/dms/image/v2/C4D0BAQEfIYMsq0Jgjg/company-logo_100_100/company-logo_100_100/0/1653123622160/gamma_paradigm_research_logo?e=1767225600&v=beta&t=Fe9kX0abGP5FmUhZIeX8lcPyWaLbamwWFgHL1mMw1m4",
        "filename": "gamma_paradigm_logo.png"
    },
    {
        "url": "https://media.licdn.com/dms/image/v2/C4D0BAQEMmhF9TqUCgA/company-logo_100_100/company-logo_100_100/0/1630545704089/university_of_washington_logo?e=1767225600&v=beta&t=CsuSTIqEb0rt7BwJNYzrKpExW8sq5T-wfWuW9IKr9-U",
        "filename": "uw_logo.png"
    },
    {
        "url": "https://media.licdn.com/dms/image/v2/C560BAQGAh08jkWo23Q/company-logo_100_100/company-logo_100_100/0/1679904708552/national_taiwan_university_logo?e=1767225600&v=beta&t=qsit03kDMX6aVDtEPQz3U2Ef8-Y2wV_R45Kckzvf560",
        "filename": "ntu_logo.png"
    }
]

def download_logo(url, filename):
    """Download a logo from URL and save to filename."""
    try:
        # Create a request with a user agent to avoid blocking
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        print(f"Downloading {filename}...", end=" ")
        with urllib.request.urlopen(req) as response:
            with open(filename, 'wb') as out_file:
                out_file.write(response.read())
        print("✓ Success")
        return True
    except Exception as e:
        print(f"✗ Failed: {e}")
        return False

def main():
    """Main function to download all logos."""
    print("Downloading LinkedIn company logos...\n")
    
    success_count = 0
    for logo in LOGOS:
        if download_logo(logo["url"], logo["filename"]):
            success_count += 1
    
    print(f"\nCompleted: {success_count}/{len(LOGOS)} logos downloaded")
    
    if success_count == len(LOGOS):
        print("All logos downloaded successfully! Your website is now using local images.")
    else:
        print("Some downloads failed. You may need to manually download the images.")
        print("Right-click each logo on LinkedIn and 'Save image as...'")

if __name__ == "__main__":
    main()


