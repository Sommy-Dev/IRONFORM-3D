# IRONFORM Athletic — Landing Page (Owerri, Nigeria)

High-performance frontend landing page for **IRONFORM**, premier conditioning and strength arena in Owerri, Imo State, Nigeria. Engineered to match the high-contrast Stitch design system with deep void canvas (`#0B0F14`), elevated charcoal cards (`#111827`), electric lime interactive accents (`#A3E635`), Space Grotesk display headlines, and Plus Jakarta Sans body typography.

## Project Structure

```text
├── index.html                   # HTML entry point with Space Grotesk & Plus Jakarta Sans fonts
├── metadata.json                # Project identity metadata
├── package.json                 # Dependencies & scripts
├── public/
│   └── images/                  # All local photography (Black Nigerian athletes & trainers)
│       ├── hero.jpg             # High-impact hero athlete image
│       ├── class-strength.jpg   # Strength & Hypertrophy class
│       ├── class-conditioning.jpg # High-Intensity MetCon class
│       ├── class-mobility.jpg   # Functional Mobility & Core class
│       ├── class-combat.jpg     # Boxing & Combat Conditioning class
│       ├── trainer-1.jpg        # Coach Emeka Nwosu (Head Strength)
│       ├── trainer-2.jpg        # Coach Chidi Okonkwo (Olympic Lifting)
│       ├── trainer-3.jpg        # Coach Somto Eze (Movement & Mobility)
│       ├── testimonial-1.jpg    # Member: Ikenna Oparah
│       ├── testimonial-2.jpg    # Member: Dr. Kelechi Nwachukwu
│       └── testimonial-3.jpg    # Member: Chinedu Amadi
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Sticky header with mobile drawer & smooth anchor scrolling
│   │   ├── Hero.tsx             # Hero section with value prop, dual CTAs & facility telemetry
│   │   ├── StatsStrip.tsx       # 4 athletic KPIs with tabular figures
│   │   ├── ClassesSection.tsx   # 4 class cards with intensity meters & spot reservation
│   │   ├── TrainersSection.tsx  # 3 certified trainer profile cards
│   │   ├── PricingSection.tsx   # 3 membership tiers (Monthly highlighted as most popular)
│   │   ├── TestimonialsSection.tsx # Real member transformations from Owerri residents
│   │   ├── CtaBanner.tsx        # High-contrast "Your first week is free" banner
│   │   ├── SignUpForm.tsx       # Accessible client-side registration form with live validation
│   │   ├── Footer.tsx           # Facility address, opening hours, WhatsApp & social links
│   │   └── SafeImage.tsx        # Resilient image component with styled fallback container
│   ├── data/
│   │   └── gymData.ts           # Centralized data store for classes, trainers, pricing & copy
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces for gym entities & form state
│   ├── App.tsx                  # Root component orchestrating section sequence & scroll handlers
│   ├── index.css                # Tailwind CSS v4 setup, custom theme tokens & focus rings
│   └── main.tsx                 # React DOM mount point
└── tsconfig.json                # TypeScript compiler configuration
```

## How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000` (or the port Vite outputs).

3. **Build for production:**
   ```bash
   npm run build
   ```

## Deploying to Vercel

This is a pure frontend, zero-backend React + Vite application. It can be deployed directly to Vercel with zero extra configuration:
1. Push this repository to GitHub / GitLab / Bitbucket.
2. In Vercel, click **"Add New Project"** and import the repository.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

## How to Replace the Photos

All images are conveniently placed in the `/public/images/` directory with descriptive, standard filenames:
- Simply overwrite any of the `.jpg` files in `/public/images/` with your own photography using the same filename (e.g., replace `/public/images/hero.jpg` with your gym's photo).
- Recommended aspect ratios:
  - `hero.jpg`: 3:4 or 4:5 vertical portrait
  - `class-*.jpg`: 16:9 or 16:10 landscape
  - `trainer-*.jpg`: 4:5 vertical portrait
  - `testimonial-*.jpg`: 1:1 square portrait

## Design System Specifications

- **Global Canvas:** `#0B0F14` (Deep Void Slate)
- **Elevated Surfaces / Cards:** `#111827` (Elevated Charcoal)
- **Hairline Outlines:** `#1F2937` (subtle border) & `#374151` (hover border)
- **Primary Accent:** `#A3E635` (Electric Lime)
- **Primary Text:** `#FFFFFF` and `#E0E2EA`
- **Secondary Text:** `#94A3B8`
- **Typography:**
  - Headlines & Metrics: `Space Grotesk` (tight tracking `-0.02em` to `-0.04em`, tabular numbers)
  - Body copy: `Plus Jakarta Sans`
- **Accessibility:** Semantic HTML elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<form>`), explicit `alt` text on all images, and visible keyboard focus states on all interactive controls.
