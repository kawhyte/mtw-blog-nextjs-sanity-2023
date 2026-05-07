# Vibrant Neo-Brutalist Design System

Single source of truth for the Meet The Whytes visual language.

---

## Color Palette

| Token | CSS Variable | Hex Approx. | Usage |
|---|---|---|---|
| `background` | `--background` | `#F8F9FA` | Main page background (`bg-background`) |
| `foreground` | `--foreground` | `#1F2937` | Primary text, structural borders, block shadows |
| `card` | `--card` | `#FFFFFF` | Card and modal backgrounds |
| `primary` | `--primary` | `#EC4899` | Primary actions, highlights, active states |
| `secondary` | `--secondary` | `#6366F1` | Secondary actions, accent elements |
| `tertiary` | `--tertiary` | `#FCE7F3` | Large decorative surfaces, section backgrounds |
| `muted` | `--muted` | `#E5E7EB` | Subtle structural lines, disabled states |
| `border-bold` | `--border-bold` | `#1F2937` | 4px Neo-Brutalist structural borders |

### Tailwind Usage

```html
<!-- Neo-Brutalist card -->
<div class="bg-card border-4 border-border-bold shadow-brutalist rounded-lg p-6">

<!-- Primary action button -->
<button class="bg-primary text-primary-foreground border-4 border-border-bold shadow-brutalist hover:shadow-brutalist-pressed hover:translate-x-[2px] hover:translate-y-[2px] transition-all">

<!-- Large decorative section -->
<section class="bg-tertiary">
```

---

## Typography

### Typefaces

| Role | Font | Weight | Usage |
|---|---|---|---|
| H1 | Epilogue | 800 (Extrabold) | Hero headlines |
| H2 | Epilogue | 700 (Bold) | Section titles |
| Body | Plus Jakarta Sans | 400 (Regular) | Paragraph text, line-height 1.6 |
| Subheader label | Plus Jakarta Sans | 700 (Bold) | Section zone labels (uppercase, tracked) |

### Tailwind Font Classes

```html
<!-- Heading -->
<h1 class="font-epilogue font-extrabold tracking-tighter">

<!-- Body -->
<p class="font-plus-jakarta-sans leading-relaxed">
```

### Subheader Label Pattern

Secondary section headers (e.g., "Things We Like", "Arena Details") must use this structural pattern instead of decorative underlines:

```html
<h3 class="text-sm font-bold uppercase tracking-widest border-b-4 border-foreground pb-2 mb-6">
  Section Label
</h3>
```

---

## Borders & Shadows

The signature Neo-Brutalist effect is the **4px solid border + 4px solid block shadow** combination. There are no blurred or ambient shadows anywhere in this system.

```css
/* 4px structural border */
border: 4px solid hsl(var(--foreground));   /* Tailwind: border-4 border-border-bold */

/* Block shadow — unblurred, solid offset */
box-shadow: 4px 4px 0px 0px hsl(var(--foreground));   /* Tailwind: shadow-brutalist */
box-shadow: 2px 2px 0px 0px hsl(var(--foreground));   /* Tailwind: shadow-brutalist-sm */
```

### Hover / Press State

Interactive elements simulate physical depression on hover — they translate into their shadow rather than floating up:

```html
<div class="shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutalist-sm transition-all duration-100">
```

---

## Spacing Rhythm

All page-level vertical spacing is managed by the `<Section>` component (`components/ui/Section.tsx`). Do not add manual `py-*` classes to page-level containers.

| Variant | Classes | Use When |
|---|---|---|
| `tight` | `py-8 md:py-12` | Dense content blocks, article bodies |
| `standard` | `py-16 md:py-24` | Standard page sections |
| `loose` | `py-24 md:py-32` | Hero sections, major page breaks |

Micro-spacing inside cards uses a fixed 16px/24px system (`p-4`/`p-6`).

---

## Border Radius

| Context | Value | Tailwind |
|---|---|---|
| Buttons, inputs | `8px` | `rounded-lg` |
| Cards | `16px` | `rounded-2xl` |

---

## Iconography

Icons must remain sharp and geometric to match the heavy border aesthetic. Use `stroke-width: 2.5` on all stroke-based icons (Lucide default is 2 — override where needed).
