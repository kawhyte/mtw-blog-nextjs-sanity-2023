# ImageRocket Claude Code Prompt

Paste the following prompt into Claude Code inside the `image-converter-pwa` repo:

---

I need you to update the optimization presets in this ImageRocket app. This app is used to prepare images before uploading to a Sanity CMS blog. Sanity CDN handles all resizing on-the-fly, so images should be uploaded at HIGH resolution — not at display size. Here are the exact changes needed:

## 1. Raise default quality from 80% → 88% on all presets
Sanity CDN can compress down when serving, but cannot add quality back. 88% gives the CDN headroom.

## 2. Update preset dimensions as follows:

**Cover Photos:**
- "Hotel & Food Cover": 1200×800 → 2400×1600
- "Travel Guide Cover": 1600×840 → 2400×1260
- "Arena Hero Photo": 1600×1067 → 3200×2134
- "View From My Seat": 1600×1200 → 2400×1800

**Gallery & Body:**
- "Gallery & Body Images": max 1600px → max 2400px

**Card Items:**
- "Arena Food & Drinks": 900×600 → 1800×1200

**PNG Assets — no changes:**
- Team Logos: keep 200×200 PNG
- Product Images: keep 800×800 PNG

## 3. Remove or make optional the forced center-crop behavior
The current converter center-crops images to the exact output aspect ratio before converting. This is wasted work — Sanity CDN does its own smart crop using hotspot data. Change the behavior so the default is to resize (constrain longest edge to the target width) WITHOUT cropping. If a "crop to fit" option is useful to keep, make it an opt-in toggle rather than always-on.

## Important
- Do not break any existing functionality
- Run type-check and lint after making changes to confirm nothing is broken
- The preset names and categories should stay the same — only the dimensions, quality, and crop behavior change
