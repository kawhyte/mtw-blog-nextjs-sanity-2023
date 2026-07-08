# Sanity `guide` document — shape cheat sheet

Source of truth: `schemas/guide.ts`. This is a condensed reference for generating draft JSON for `scripts/create-guide-draft.mjs`.

## Top-level fields (the script's JSON payload)

```jsonc
{
  "title": "string (required)",
  "slug": "string — lowercase-hyphenated, ≤96 chars (required; script wraps it as {_type:'slug', current})",
  "date": "ISO datetime (required; defaults to now if omitted)",
  "category": "one of: city | tips | transport | culture | adventure | family | budget | luxury (optional)",
  "location": "string, e.g. \"Dallas, TX\" (optional, strong local-SEO signal)",
  "summary": "string ≤160 chars — meta description (ideal 120–155)",
  "tags": ["string", "..."],
  "content": [ /* portable text array, see below */ ]
}
```

Not set by the script (Kenny handles in Studio): `coverImage`, `gallery`, `publishedAt`. Documents are created as `drafts.guide-<slug>` and never published by the script.

## Content block types

Every block and child needs a unique `_key` (script backfills missing ones).

### Text block (styles: `normal`, `h2`, `h3`, `blockquote`)

```json
{ "_type": "block", "_key": "k1", "style": "h2", "markDefs": [],
  "children": [{ "_type": "span", "_key": "k2", "text": "Heading text", "marks": [] }] }
```

Decorators: `strong`, `em`, `underline` (in a span's `marks` array).

Link (annotation): put a markDef key in the span's `marks`, and the def in `markDefs`:

```json
{ "_type": "block", "_key": "k3", "style": "normal",
  "markDefs": [{ "_type": "link", "_key": "lk1", "href": "https://www.meetthewhytes.com/guides" }],
  "children": [
    { "_type": "span", "_key": "k4", "text": "See our ", "marks": [] },
    { "_type": "span", "_key": "k5", "text": "other guides", "marks": ["lk1"] }
  ] }
```

### Image (also the photo-placeholder pattern — image block with alt+caption, NO asset)

```json
{ "_type": "image", "_key": "k6",
  "alt": "What the photo should show (SEO alt text)",
  "caption": "Caption shown under the photo" }
```

### Callout (`type`: `tip` | `warning` | `info` | `highlight`; text is an array of blocks)

```json
{ "_type": "callout", "_key": "k7", "type": "tip",
  "text": [{ "_type": "block", "_key": "k8", "style": "normal", "markDefs": [],
             "children": [{ "_type": "span", "_key": "k9", "text": "Tip text.", "marks": [] }] }] }
```

### Video embed — ONLY with a real URL (`url` is required by validation)

```json
{ "_type": "videoEmbed", "_key": "k10", "url": "https://www.youtube.com/watch?v=...",
  "title": "SEO video title", "caption": "Shown below the video" }
```

### Other available blocks (rarely generated; Kenny usually adds in Studio)

- `imageGroup` — `{ layout: "2-col"|"3-col"|"4-col", images: [2–4 images with required alt] }`
- `mediaWithText` — `{ image (alt required), text: block[], imagePosition: "left"|"right" }`

## Validation gotchas

- `summary` max 160 chars (schema-validated) — count before writing.
- `videoEmbed.url` required — never emit an empty one.
- `imageGroup.images` min 2 / max 4, alt required on each.
- Slug must be unique across guides (script uses deterministic draft ID `drafts.guide-<slug>`, so re-runs update rather than duplicate).
