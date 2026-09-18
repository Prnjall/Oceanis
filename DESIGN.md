---
name: Orbital Precision
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#45474b'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#75777b'
  outline-variant: '#c5c6cb'
  surface-tint: '#595f67'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#161c23'
  on-primary-container: '#7e848d'
  inverse-primary: '#c1c7d1'
  secondary: '#54606b'
  on-secondary: '#ffffff'
  secondary-container: '#d5e1ef'
  on-secondary-container: '#59646f'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001849'
  on-tertiary-container: '#447cff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde3ed'
  primary-fixed-dim: '#c1c7d1'
  on-primary-fixed: '#161c23'
  on-primary-fixed-variant: '#41474f'
  secondary-fixed: '#d8e4f1'
  secondary-fixed-dim: '#bcc8d5'
  on-secondary-fixed: '#121d26'
  on-secondary-fixed-variant: '#3d4853'
  tertiary-fixed: '#dae1ff'
  tertiary-fixed-dim: '#b3c5ff'
  on-tertiary-fixed: '#001849'
  on-tertiary-fixed-variant: '#003fa4'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 78px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 46px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 54px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lead:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-default:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-eyebrow:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.15em
  label-nav:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption-data:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.05em
spacing:
  gutter: 2.5rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-mobile: 1.5rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.5rem
  space-lg: 3rem
  space-xl: 5rem
---

## Brand & Style

This design system embodies the stark, clinical elegance of Earth observation and aerospace intelligence. It merges editorial restraint with planetary-scale technological authority.

### Design Personality
- **Sovereign Clarity:** Uncompromising legibility, calm conviction, and institutional reliability.
- **Atmospheric Contrast:** Monochromatic starkness punctuated by cinematic satellite and deep-ocean imagery.
- **Scientific Restraint:** Avoids decorative tech tropes, synthetic neon glows, or pseudo-sci-fi HUD graphics. Visual tension is achieved solely through stark typographic scale, generous white space, and high-fidelity radar/optical imagery.

### Aesthetic Movement
The aesthetic is rooted in **Swiss International Style Minimalist Corporate Editorial**. Clean light-gray and pure-white presentation canvases alternate abruptly with full-bleed nocturnal and maritime deep-ocean dark sections (#0A1118). Micro-typography, tracked labels, and crisp hairline rules act as analytical anchors.

## Colors

The palette relies on stark optical contrast between oceanic deep-space carbon tones and clean, matte off-whites.

### Palette Architecture
- **Primary (`#0D131A`):** Deep oceanic charcoal used for heavy headlines, primary inverted backgrounds, and high-emphasis interface chrome.
- **Secondary (`#3E4954`):** Controlled graphite gray for long-form narrative body copy and secondary labels, preventing harsh black-on-white vibration.
- **Tertiary (`#0066FF`):** Restrained telemetry blue used sparingly for acute interactive states, data anchors, and focal indicators.
- **Neutral (`#F4F5F7`):** Muted cool off-white serving as the foundational light section background, contrasting with pure `#FFFFFF` card surfaces.

### Surface System
- `surface-canvas-light`: `#F4F5F7`
- `surface-card-light`: `#FFFFFF`
- `surface-canvas-dark`: `#0A1118` (Atmospheric deep maritime/space canvas)
- `border-hairline-light`: `rgba(13, 19, 26, 0.12)`
- `border-hairline-dark`: `rgba(255, 255, 255, 0.15)`

## Typography

The type system pairs a modern neo-grotesque (Inter) for natural editorial poise with a monospaced coordinate font (Space Mono) for orbital metrics, telemetry tags, and structural categorization.

### Execution Rules
- **Display & Large Headlines:** Rendered primarily in regular (`400`) or medium (`500`) weights with tight tracking (`-0.04em` to `-0.02em`), channeling architectural precision rather than aggressive digital boldness.
- **Eyebrows & Section Markers:** Set in uppercase monospaced type with generous tracking (`0.15em`), placed with disciplined spacing above section titles.
- **Body & Editorial Columns:** Line length should maintain an optimal 55–68 character measure with relaxed line heights (`1.5` to `1.6`) to provide unhurried readability against quiet gray backgrounds.

## Layout & Spacing

Layouts follow a disciplined 12-column architectural grid with generous section breathing room.

### Rhythm & Proportions
- **Desktop (1440px+):** 12 columns with 4rem outer canvas margins and 2.5rem gutters. Section vertical padding uses generous scales (6rem to 10rem) to foster an unhurried, institutional editorial tone.
- **Three-Column Feature Architecture:** Core value propositions and technical capabilities are organized into clean 3-column structures (4 columns per item on desktop, collapsing to 1 column on mobile).
- **Tablet (768px - 1024px):** Reflows to a 6-column system with 2rem margins.
- **Mobile (< 768px):** Reflows to a 4-column system with 1.5rem canvas margins and 1rem gutters. Feature blocks stack vertically with 2.5rem inter-item separation.

## Elevation & Depth

This system intentionally eliminates traditional drop shadows, blurry skeuomorphic depth, and synthetic outer glows. Spatial structure is defined purely by planar tonal contrast and precise hairline boundaries.

### Depth Strategy
- **Planar Stacking:** Depth is achieved by placing razor-sharp `#FFFFFF` surfaces over muted `#F4F5F7` backdrops, or by transitioning abruptly into deep `#0A1118` dark viewports.
- **Low-Contrast Hairlines:** Subtle borders (`1px solid rgba(13, 19, 26, 0.1)`) delineate editorial cells, cards, and metadata panels. In dark imagery viewports, borders convert to `1px solid rgba(255, 255, 255, 0.15)`.
- **Annotation Lines & Reticles:** In satellite and radar viewports, technical pointers and callouts use hairline white SVG stems (`1px`) anchored by circular pips without blur or outer drop shadows.

## Shapes

The geometric signature is pure, unrounded, and razor-sharp (`roundedness: 0`). 

### Structural Form
- **Zero Radius:** Buttons, imagery viewports, input containers, and structural feature cells possess strict `0px` border radii. This produces a technical, scientific, and print-editorial caliber layout.
- **Circular Data Anchors:** The only curved geometry permitted in the system is functional data callouts (e.g., target tracking pips, orbital coordinate reticles, status dots) which are strictly circular.

## Components

### Buttons
- **Primary Dark Button:** Solid `#0D131A` fill, white Inter Medium 14px label, 0px border radius, vertical padding `0.875rem`, horizontal padding `1.75rem`. Zero shadow. Hover state shifts background to `#222D3A`.
- **Secondary Outlined Button:** Transparent fill, `1px solid #0D131A` border (or `1px solid #FFFFFF` on dark sections), matching label color. Hover shifts to subtle tinted wash (`rgba(13, 19, 26, 0.05)` or `rgba(255, 255, 255, 0.1)`).
- **Text Link Button:** Monospaced or sans-serif label followed by a clean directional arrow (`→`), underlined only on hover with a 1px offset line.

### Cards & Feature Modules
- **Editorial Text Cell:** Borderless, zero-elevation modular blocks. Consists of a medium headline (20px) followed by a 1.5rem paragraph gap and calm secondary gray body text (`#3E4954`).
- **Media Card:** Clean rectangular full-bleed container with zero corner radius. Overlaid metadata tags are anchored to corners using monospaced labels on translucent dark backing (`rgba(10, 17, 24, 0.75)`).

### Metadata Badges & Reticles
- **Eyebrow Tag:** Space Mono, 11px, uppercase, letter-spacing `0.15em`, displayed in `#5C6672` or `#A0AEC0`.
- **Spatial Annotation Reticle:** 1px white stroke circle identifying targets (e.g., ship, slick, installation) connected to a 1px vertical hairline leading to crisp monospaced annotation text.

### Navigation & Menus
- **Global Header:** Ultra-clean horizontal bar spanning full width. Transparent over imagery with transition to `#FFFFFF` on scroll. Brand logotype tracked widely in uppercase. Secondary navigation items set in 13px Inter regular with 2rem horizontal spacing.
- **Sub-navigation Bar:** Single hairline row displaying contextual domain filters (e.g., Maritime, Defense, Port) separated by generous spacing with active states indicated by a solid bottom underline.

### Input Fields & Controls
- **Inputs:** Crisp 1px hairline rectangular boundary (`#0D131A` at 20% opacity), zero border radius, spacious internal padding (`0.75rem 1rem`), typography set in 14px Inter. Focus state sharpens border to 100% `#0D131A` with zero ring shadow.
- **Checkboxes & Radios:** Sharp geometric boxes and circles with 1px border stroke; checked states fill with solid primary black with clean interior contrast.