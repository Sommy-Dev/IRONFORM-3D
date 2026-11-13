---
name: Ironform Athletic
colors:
  surface: '#101419'
  surface-dim: '#101419'
  surface-bright: '#36393f'
  surface-container-lowest: '#0a0e13'
  surface-container-low: '#181c21'
  surface-container: '#1c2025'
  surface-container-high: '#262a30'
  surface-container-highest: '#31353b'
  on-surface: '#e0e2ea'
  on-surface-variant: '#c2cab0'
  inverse-surface: '#e0e2ea'
  inverse-on-surface: '#2d3136'
  outline: '#8c947c'
  outline-variant: '#424936'
  surface-tint: '#98da27'
  primary: '#ccff80'
  on-primary: '#213600'
  primary-container: '#a3e635'
  on-primary-container: '#416400'
  inverse-primary: '#446900'
  secondary: '#c0c6db'
  on-secondary: '#293040'
  secondary-container: '#404758'
  on-secondary-container: '#aeb5c9'
  tertiary: '#e8efff'
  on-tertiary: '#273140'
  tertiary-container: '#c9d3e7'
  on-tertiary-container: '#515b6c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b2f746'
  primary-fixed-dim: '#98da27'
  on-primary-fixed: '#121f00'
  on-primary-fixed-variant: '#334f00'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#d9e3f7'
  tertiary-fixed-dim: '#bdc7db'
  on-tertiary-fixed: '#121c2a'
  on-tertiary-fixed-variant: '#3d4757'
  background: '#101419'
  on-background: '#e0e2ea'
  surface-variant: '#31353b'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses disciplined power, kinetic vitality, and modern luxury tailored for a premier conditioning gym in Owerri, Nigeria. It pairs deep-toned atmospheric environments with sharp, vibrant accents to project an aura of high-performance focus and elite athleticism.

The visual style is **High-Contrast Modern Athletic**. It borrows from technical sportswear UI and contemporary architectural brutalism: pure deep blacks, rich carbon surfaces, structured borders, and hyper-legible typographic hierarchy. The aesthetic delivers an uncompromising feeling of forward momentum, elite performance, and physical transformation while maintaining effortless digital clarity.

## Colors

The color palette operates on a high-contrast dark foundation engineered to command focus and reduce visual noise:

- **Primary (`#A3E635` - Electric Lime):** Used strictly for high-priority interactive cues, primary calls to action, biometric spikes, and active operational states. Paired with dark carbon text (`#0B0F14`) for optimal contrast and punch.
- **Neutral Canvas (`#0B0F14` - Deep Void Slate):** The underlying global canvas. Absorbs excess ambient glare and establishes a heavy, grounded base.
- **Secondary Surface (`#111827` - Elevated Charcoal):** Dedicated card, modal, and structural panel background tone, separating content zones from the deep background without muddy drop shadows.
- **Structural Outlines (`#1F2937` & `#374151` - Slate Dividers):** Subtle technical borders that define shapes and boundaries with surgical precision.
- **Text & Foreground:** Pure crisp white (`#FFFFFF`) for primary titles and metrics; cool slate (`#94A3B8`) for metadata, subheadings, and supporting body copy.

## Typography

The typographic engine pairs **Space Grotesk** for display headlines, metrics, and labels with **Plus Jakarta Sans** for body readability.

- **Headlines & Numbers:** Rendered in Space Grotesk with deliberate negative letter tracking (`-0.02em` to `-0.04em`). This compacts letterforms into dense, athletic typographic blocks reminiscent of timing scoreboards and performance readouts.
- **Body & Longform:** Handled by Plus Jakarta Sans to deliver frictionless clarity, generous x-height, and neutral pacing across schedules, trainer bios, and workout programming.
- **Labels & Microcopy:** Rendered with Space Grotesk in uppercase or semi-expanded tracking (`0.02em` to `0.08em`) to enforce technical precision across badges, workout categories, and equipment tags.

## Layout & Spacing

The layout is built on a 12-column responsive fluid grid on desktop (scaling to 6 columns on tablet and 4 columns on mobile), locked into an 8px base rhythmic scale.

- **Canvas & Section Bounds:** Desktop experiences anchor to a maximum width of 1440px with `margin: 2rem` exterior padding. Mobile layouts compress to `margin-mobile: 1rem` to preserve screen real estate for class timetables and live tracking widgets.
- **Grid Gaps & Flow:** Desktop uses a rigid `gutter: 1.5rem` (`24px`), reducing to `gutter-mobile: 1rem` (`16px`) on handheld viewports.
- **Density:** Spacing inside cards and modular components prioritizes tight, dense, structured packaging (`space-sm` to `space-md`) rather than sprawling whitespace, giving workouts and dashboards an energetic, data-forward density.

## Elevation & Depth

This design system avoids blurry skeuomorphic drop shadows in favor of **structural tonal layering** and **crisp technical hairline borders**:

1. **Base Layer:** The global canvas (#0B0F14).
2. **Elevated Containers & Cards:** Tinted charcoal surfaces (#111827) bordered with a 1px solid stroke in `#1F2937`.
3. **Hover & Interactive Layer:** Higher-tier interactive components step up to `#1F2937` backgrounds with `#374151` borders, accented by an ambient lime glow (`box-shadow: 0 0 20px -4px rgba(163, 230, 53, 0.15)`) only on primary active triggers.
4. **Modals & Floating Elements:** Float over a 60% opacity deep slate backdrop blur (`backdrop-filter: blur(12px)`) with crisp perimeter framing (#374151).

## Shapes

Corner radii adhere strictly to an athletic range of **8px to 12px** (`roundedness: 2`).

- Standard elements (inputs, secondary buttons, list cards, metric modules) utilize an 8px radius (`rounded-md`).
- Primary cards, pricing tiers, and major hero surfaces utilize a 12px radius (`rounded-lg`).
- Full rounded pills (`rounded-full`) are reserved exclusively for live status chips (e.g., "LIVE CLASS", "CAPACITY REACHED") and biometric status pills, contrasting cleanly against the chiseled geometry of the surrounding grid.

## Components

- **Buttons:**
  - *Primary Button:* Solid Electric Lime (`#A3E635`) fill with deep void slate text (`#0B0F14`), bold Space Grotesk tracking, 8px corner radius. On hover: slight brightness lift and focused lime glow.
  - *Secondary Button:* Transparent background with 1px border (`#374151`), crisp white text (`#FFFFFF`). On hover: background shifts to `#1F2937`.
  - *Tertiary / Ghost Button:* Unbordered, muted slate text (`#94A3B8`), turning white on hover.

- **Cards:**
  - Background `#111827`, 1px border `#1F2937`, 12px radius, and internal padding of `space-md` to `space-lg`.
  - Hoverable cards (e.g., class schedule items, personal trainer profiles) shift their border color to `#374151` with instantaneous snappy transitions (150ms ease-out).

- **Chips & Badges:**
  - Subtle dark fills (`#1F2937`) with 1px hairline borders (`#374151`) and high-contrast labels.
  - Active/Highlighted chips take an electric lime outline and lime text with a 10% translucent lime fill.

- **Form Inputs:**
  - Deep charcoal `#0B0F14` or `#111827` inset background, 1px `#1F2937` border, 8px radius.
  - Placeholder text in `#64748B`. Focused state transitions border to `#A3E635` with no heavy outline rings.

- **Checkboxes & Radios:**
  - 8px/round base geometry with `#1F2937` borders. Checked state activates solid `#A3E635` with a `#0B0F14` checkmark.

- **Gym-Specific Modules:**
  - *Class Intensity Meters:* Segmented bar charts filled with Electric Lime against `#1F2937` track bars.
  - *Capacity Indicators:* Live pill badges showing available bench/rig slots with micro dot pulses.