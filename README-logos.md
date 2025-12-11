# Company Logo Management

## Problem
LinkedIn company logo URLs expire and change frequently, requiring manual updates.

## Solution
The website now uses **local image files** instead of LinkedIn URLs. This means:
- ✅ No more expired URLs
- ✅ Faster loading (no external requests)
- ✅ Works offline
- ✅ Full control over images

## Current Logo Files
The following logo files should be in this directory:
- `caltech_logo.png` - California Institute of Technology
- `northwestern_logo.png` - Northwestern University
- `gamma_paradigm_logo.png` - Gamma Paradigm Capital
- `uw_logo.png` - University of Washington
- `ntu_logo.png` - National Taiwan University

## How to Update Logos

### Option 1: Automated Download (Recommended)
Run the Python script to automatically download the latest logos:

```bash
python download-logos.py
```

Or use PowerShell:
```powershell
.\download-logos.ps1
```

### Option 2: Manual Download
1. Visit LinkedIn and find each company's page
2. Right-click on the company logo
3. Select "Save image as..."
4. Save with the exact filename (e.g., `caltech_logo.png`)
5. Place the file in this directory

### Option 3: Update URLs in Scripts
If LinkedIn URLs change, update them in:
- `download-logos.py` (Python script)
- `download-logos.ps1` (PowerShell script)

Then run the script again to download fresh images.

## Notes
- Images are referenced in `index.html` using local paths (e.g., `src="caltech_logo.png"`)
- Logo files should be PNG format for best quality
- Recommended size: 100x100 pixels (as LinkedIn provides)


