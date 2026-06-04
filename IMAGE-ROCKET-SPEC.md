# ImageRocket Preset Update Spec

## Why these changes are needed

This blog uses Sanity CDN to serve images. Sanity resizes images **on-the-fly** based on URL parameters (`width`, `height`, `quality`). The CDN is excellent at **downscaling** — it always produces crisp results. But it cannot improve a source image that is already small or already compressed.

**The current problem:** Presets output at exactly the display size (e.g., 1200×800 for a hero that displays at 1200×800). This forces Sanity CDN to serve the image at 1:1 scale with no room to improve quality. Worse, the image has already been compressed once in ImageRocket and then Sanity recompresses it — resulting in **double compression**.

**The fix:** Output at 2× the display size so Sanity always downscales. Downscaling always produces sharper, higher-quality results than serving at exact size.

---

## Quality Setting

**Change all presets from 80% → 88% quality.**

Sanity CDN can always compress down when serving, but it cannot add quality back. Uploading at 88% gives the CDN room to work. The resulting file sizes are still very manageable.

---

## Preset Changes

### Cover Photos

| Preset | Current | New | Notes |
|--------|---------|-----|-------|
| Hotel & Food Cover | 1200 × 800 | **2400 × 1600** | 2× hero display size |
| Travel Guide Cover | 1600 × 840 | **2400 × 1260** | keeps ratio, 1.5× |
| Arena Hero Photo | 1600 × 1067 | **3200 × 2134** | 2× — arenas have lots of detail |
| View From My Seat | 1600 × 1200 | **2400 × 1800** | 1.5× |

### Gallery & Body

| Preset | Current | New | Notes |
|--------|---------|-----|-------|
| Gallery & Body Images | max 1600px | **max 2400px** | more source resolution = sharper gallery |

### Card Items

| Preset | Current | New | Notes |
|--------|---------|-----|-------|
| Arena Food & Drinks | 900 × 600 | **1800 × 1200** | 2× card display size |

### PNG Assets (no change needed)

| Preset | Current | Notes |
|--------|---------|-------|
| Team Logos | 200 × 200 PNG | Logos are vector-like, keep as is |
| Product Images | 800 × 800 PNG | Fine for product shots |

---

## "Center-cropped to fit" behavior

The current converter crops images to the exact aspect ratio before converting. **This is redundant** — Sanity CDN applies its own smart crop using the hotspot data set in Sanity Studio.

Recommendation: **Remove the forced crop**, or change the behavior to only resize (constrain the longest edge) without cropping. This preserves more of the original image for Sanity's smart crop to work with.

If removing the crop is a larger change, the 2× dimensions above will still improve quality significantly even with the crop in place.

---

## Summary of changes to implement

1. **Quality slider default: 80 → 88** for all presets
2. **Preset dimensions:** double all Cover Photo and Card Item dimensions; increase Gallery to max 2400px
3. **Optional:** change crop behavior to resize-only (no forced center crop)

---

## How to verify the improvement

After uploading a new image at the larger dimensions:
1. Open any hotel or arena page on the blog
2. Open browser DevTools → Network tab → filter by `cdn.sanity.io`
3. Inspect a hero image URL — you should see `w=1200&h=800&q=85` (or similar)
4. The source image in Sanity should now be 2400px+ wide (visible in Sanity Studio)
5. The served hero should look noticeably sharper than before
