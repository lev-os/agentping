# Superdesign GenUI Prompts - Premium Component System

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

**Purpose**: Curated Superdesign prompts for building generative UI component systems for AgentPing, dashboards, and SaaS applications.

**Source**: Extracted from Superdesign prompt library
**Focus Areas**: Dashboard/SaaS UI, Card layouts, Data visualization, Minimal/modern aesthetics, Interactive components

---

## Table of Contents

1. [Style Prompts](#style-prompts)
2. [Layout Prompts](#layout-prompts)
3. [Component Prompts](#component-prompts)
4. [Recommended Theme Combinations](#recommended-theme-combinations)

---

## Style Prompts

These define the overall aesthetic, color schemes, and visual language for your GenUI components.

### Mosaic Grid Architecture Style

**Slug**: `mosaic-grid-architecture-style`

**Tags**: neutral, low contrast, forestgreen accent, cream accent, industrial, minimal, saas landing, ai first product, style, landing page

**Description**: An architectural, technical-blueprint style design system featuring a minimalist mosaic grid, forest green (#1A3C2B) and light-gray paper-textured (#F7F7F5) palette. Optimized for B2B SaaS, developer tools, and high-end agency portfolios. Key features include editorial typography with Space Grotesk, JetBrains Mono labels, bento grid layouts, and 2D flat wireframe aesthetics with zero shadows.

**Style Prompt**:

```
Create a design system using a 'Paper' background (#F7F7F5) and 'Forest Green' (#1A3C2B) as the primary brand color. Typography: Use 'Space Grotesk' for bold, tight-tracking headers (font-size: 64px-96px, line-height: 0.9); 'General Sans' for body text; and 'JetBrains Mono' for all labels, tags, and small technical metadata (font-size: 10px-12px, tracking: 0.1em). Borders: Use 1px hairlines in #3A3A38 at 20% opacity for all dividers. Palette: Primary Forest (#1A3C2B), Coral (#FF8C69), Mint (#9EFFBF), and Gold (#F4D35E). Styling: No box shadows. All components must have 0px or 2px (sm) border-radius. Images should use 'mix-blend-luminosity' with a 90% opacity and shift to full color on hover.
```

---

### Analytics dashboard

**Slug**: `analytics-dashboard`

**Tags**: dashboard, analytics dashboard, neutral, blue accent, clean palette, stripe inspired, minimalist, grid based, sass, data visualisation, enterprise software, sidebar navigation, card

**Description**: Professional SaaS analytics dashboard design featuring a clean, enterprise-grade aesthetic. Utilizing a refined blue brand palette (#3B82F6), high-contrast gray scales, and dual-font pairing (Inter for UI, JetBrains Mono for data logs). The layout employs a classic sidebar-and-main-content structure with bento-style metric cards, interactive grouped bar charts, and technical event streams. Ideal for fintech, developer tools, cloud infrastructure monitoring, and complex data-driven enterprise platforms.

**Style Prompt**:

```
Create a professional SaaS dashboard style. 

**Colors:** 
- Background: #F8F9FA
- Surface/Cards: #FFFFFF
- Primary: #3B82F6 (Hover: #2563EB)
- Text: #212529 (Secondary: #868E96)
- Border: #E9ECEF
- Status: Success (#10B981), Warning (#F59E0B), Danger (#EF4444)

**Typography:**
- UI Font: 'Inter', sans-serif; weights 400 (regular), 500 (medium), 600 (semibold).
- Data/Log Font: 'JetBrains Mono', monospace; weight 400.
- Headings: 14px Semibold tracking-tight.
- Body: 13px Regular.
- Technical Logs: 12px Mono.

**Effects:**
- Border Radius: 8px (standard), 6px (buttons/inputs).
- Shadows: 'card' (0 1px 3px rgba(0,0,0,0.1)), 'input' (0 1px 2px rgba(0,0,0,0.05)).
- Transitions: 200ms ease-in-out for hover states.
- Chart Grids: Dash-array 4, Color #E9ECEF.
```

---

### Linear inspired developer tool dashboard

**Slug**: `linear-inspired-developer-tool-dashboard`

**Tags**: dark mode, linear inspired, minimalist, high contrast, internal tool, status colour syste, dashboard, task driven

**Description**: A high-performance dark-mode console design inspired by Linear and high-end developer tools. Featuring a deep charcoal and black palette (#0e0e0e, #111113) with a vibrant indigo accent (#5e6ad2). The layout uses a classic three-pane structure: a 240px navigation sidebar, a central list view, and a 480px sliding contextual detail panel. Key aesthetics include minimal borders (white/5), Inter/JetBrains Mono typography pairing, glassmorphism overlays, and precise status indicators with subtle animations. Optimized for SaaS dashboards, developer platforms, and AI-driven workflow management tools.

**Style Prompt**:

```
### Visual Language & Style Guide

**Color Palette:**
- **Base Background:** `#0e0e0e` (main canvas).
- **Surface Background:** `#111113` (sidebar, panels).
- **Accent Color:** `#5e6ad2` (Indigo-blue) used for primary buttons, active states, and focus rings.
- **Border Color:** `rgba(255, 255, 255, 0.05)` (highly subtle separation).
- **Text Colors:** Primary: `#f3f4f6`, Secondary: `#9ca3af`, Tertiary: `#6b7280`, Muted/Mono: `#4b5563`.
- **Status Colors:** In-progress: `#f97316` (Orange), Active/Success: `#10b981` (Emerald), Error: `#ef4444` (Red).

**Typography:**
- **Sans-Serif:** 'Inter', sans-serif. Use 14px (0.875rem) for main text, 13px (0.8125rem) for secondary UI, and 11px (0.6875rem) for uppercase category labels.
- **Monospace:** 'JetBrains Mono', monospace. Use for IDs, version numbers, and system logs at 10px-12px.
- **Font Weights:** Medium (500) for headers/buttons, Regular (400) for body, Semi-bold (600) for page titles.

**Shadows & Depth:**
- **Panel Shadow:** `0 4px 20px rgba(0,0,0,0.4)`.
- **Glass Effect:** `backdrop-filter: blur(8px); background: rgba(30, 30, 30, 0.8)` for floating elements.

**Micro-Interactions:**
- **Focus States:** 2px solid outline/box-shadow of `#5e6ad2`.
- **Hover Transitions:** 150ms-200ms ease-in-out on backgrounds and text colors.
- **Slide-in Animation:** 0.2s duration using `cubic-bezier(0.16, 1, 0.3, 1)` for panels entering from the right.
```

---

### Enterprise Admin Platform

**Slug**: `enterprise-admin-platform`

**Tags**: slate colour, high contrast, enterprise software, minimalist, brutalist, grid based, sass, landing page, b2b, admin platform, leads generation

**Description**: Enterprise Admin Platform is a professional, high-trust landing page design for corporate B2B SaaS, fintech, and infrastructure tools. It features a muted corporate color palette (whites, deep slates, and technical blues), a structured grid-based layout, and a focus on operational control and security. Key elements include a high-fidelity dashboard preview, KPI count-up animations, and a glass-morphism navigation bar. Suitable for enterprise management systems, cybersecurity platforms, and developer infrastructure tools.

**Style Prompt**:

```
Create a design with a professional enterprise aesthetic. 
- **Typography**: Use 'Satoshi' sans-serif. Headers should be Bold/ExtraBold with tight tracking (-0.02em). Body text in Slate 500/600 with 1.625 line-height.
- **Colors**: Primary: #2563eb, Deep Slate: #151e2e, Background: #ffffff, Muted BG: #f8fafc. Accents: Success (#16a34a), Warning (#d97706), Error (#dc2626).
- **Borders & Radius**: Border-radius 12px for cards, 8px for buttons. Borders should be 1px solid #e2e8f0.
- **Effects**: Navigation uses a 'glass-panel' effect: background rgba(255, 255, 255, 0.7) with 12px backdrop-filter blur. Hero background uses a 40px x 40px gray grid line pattern.
- **Animations**: Implement 'fadeInUp' (0.8s duration, 20px offset) for section reveals. Use cubic-bezier(0.4, 0, 0.2, 1) for all hover transitions.
```

---

### Modular Card Dashboard

**Slug**: `modular-card-dashboard`

**Tags**: mobile app, home, layout

**Description**: A high-contrast wireframe dashboard style featuring a modular card-based system. Characterized by a 'neubrutalism-lite' aesthetic with heavy black borders, hard shadows on hover, and a strict grayscale palette. It utilizes clean editorial typography (Switzer) and a minimalist approach to data visualization. Perfect for SaaS management tools, fintech mobile apps, developer dashboards, and productivity interfaces where structural clarity and modularity are prioritized over colorful decoration.

**Style Prompt**:

```
Apply a minimalist wireframe aesthetic. Background color: #F5F5F5. Card background: #FFFFFF. Primary text and borders: #111111. Secondary text: #6B7280. Borders: 1px solid #111111. Typography: Use 'Switzer' font family; Headings at font-weight 600, labels at font-weight 500 with letter-spacing 0.05em. Interactive states: When a card is hovered or focused, it should translate -2px on the Y-axis and gain a hard shadow: box-shadow: 4px 4px 0px 0px rgba(0,0,0,1). Use a 200ms ease-in-out transition for all state changes. Spacing: 24px (6 units) standard padding for sections, 20px (5 units) internal card padding.
```

---

### Bento Configuration Dashboard

**Slug**: `bento-configuration-dashboard`

**Tags**: onboarding, page, light mode, warm colour, neutral, stone colour, teal accent, sass, bento grid, workspace setup, responsible admin dashboard, modern

**Description**: Bento Configuration Dashboard style: A professional, non-linear SaaS onboarding layout using a modular bento grid. Features soft stone-neutral bases with a sophisticated teal accent (#14b8a6). Typography combines Plus Jakarta Sans for headings and Inter for UI elements. Designed for fintech, workspace management, and developer tools. Employs glassmorphism-lite with 20% opacity card tints, inset borders for depth, and smooth cubic-bezier transitions. Includes a circular SVG progress tracker and multi-state setup cards.

**Style Prompt**:

```
Create a design system with the following specs: 
- **Colors**: Base bg: #fafaf9 (Stone 50); Primary Text: #1c1917 (Stone 900); Secondary Text: #78716c (Stone 500); Global Accent: #14b8a6 (Teal 500). 
- **Typography**: Display font: 'Plus Jakarta Sans', weights 600, 700. Body font: 'Inter', weights 400, 500. H1 size: 36px/40px. H2 size: 20px. UI labels: 12px-14px. 
- **Cards**: Border-radius 16px (2xl). Backgrounds: Color tints at 20% opacity (e.g., #eff6ff33 for blue). Border: 1px solid at 10% opacity, with an additional absolute-positioned inset border at 30% opacity. 
- **Shadows**: Soft elevation (0 4px 20px -2px rgba(0,0,0,0.05)) on cards. 
- **Animation**: Hover transform: translateY(-2px) with cubic-bezier(0.25, 0.8, 0.25, 1). Progress rings: SVG stroke-dasharray transitions.
```

---

### Glassmorphism HR Dashboard

**Slug**: `glassmorphism-hr-dashboard`

**Description**: A futuristic Glassmorphism HR & Finance dashboard featuring a dark mode aesthetic with vibrant gradients and frosted glass effects. Designed for HR management, salary tracking, and fintech platforms, it utilizes a sophisticated dark indigo background (#0f172a) paired with glowing blue (#667eea) and purple (#764ba2) accents. Key elements include bento-grid layouts, SVG-based data visualizations, smooth staggered animations, and a focus on Arabic RTL typography (Cairo font). It balances high-end visual fidelity with functional information density.

**Style Prompt**:

```
Implement a design system based on a dark-mode palette: Background #0f172a, Surface rgba(17, 24, 39, 0.6). Glass Panels: Apply `backdrop-filter: blur(16px)`, `border: 1px solid rgba(255, 255, 255, 0.08)`, and a subtle shadow `0 4px 30px rgba(0, 0, 0, 0.1)`. Typography: Use 'Cairo' font family. Headers: Bold, 1.25rem to 1.875rem. Body: 0.875rem, slate-300 color. Data/Numbers: Use monospace or semi-bold weights for legibility. Color Palette: Primary #667eea, Secondary #764ba2, Success #4facfe, Warning #fee140, Danger #f5576c. Animations: 1. `blob` movement for background (scale 0.9 to 1.1 with 7s duration), 2. `slide-up` entrance (20px Y-offset to 0, ease-out, 0.6s), 3. `growBar` for SVG elements (scaleY from 0 to 1). Hover States: Lift cards by 5px and increase border opacity to 0.2.
```

---

### HORIZON Minimalist Command Dashboard

**Slug**: `horizon-minimalist-command-dashboard`

**Description**: A high-end minimalist command dashboard designed for venture studios and fintech platforms. Features a dark mode aesthetic using precise OKLCH color spaces, editorial typography (Instrument Sans), and hairline borders (0.5px). Optimized for complex data visualization with a 'Command and Control' feel, utilizing bento grids, subtle backdrop blurs, and micro-interactions like slow-pinging status indicators.

**Style Prompt**:

```
Create a minimalist dark-themed dashboard using the following specs: 
- **Color Palette (OKLCH)**: 
  - Background: `oklch(0.09 0.012 255)` (Deep Obsidian)
  - Sidebar: `oklch(0.07 0.012 255)`
  - Surface: `oklch(0.12 0.012 255)`
  - Accents: Gold `oklch(0.82 0.12 95)`, Coral/Alert `oklch(0.70 0.22 20)`, Mint/Success `oklch(0.75 0.18 165)`, Amber/Warning `oklch(0.76 0.16 75)`
- **Typography**: 
  - Primary Font: 'Instrument Sans'
  - Headers: 24px, medium weight, tight tracking
  - Labels: 10px, uppercase, 0.2em letter-spacing, bold
  - Body: 14px, muted `oklch(0.58 0.008 255)` for secondary text
- **Borders**: 0.5px (hairline) using `white/5%` or `white/10%` opacity.
- **Micro-interactions**: Subtle 2s pinging animations for status dots, 150ms transitions on hover, and custom 4px thin scrollbars.
```

---

### Card Grid Browse

**Slug**: `card-grid-browse`

**Tags**: mobile app, index, browse, layout

**Description**: A sophisticated, mobile-first product browsing layout emphasizing whitespace, clean typography, and a stable 2-column grid. The design utilizes a monochrome base with slate-toned neutrals to create a high-end 'boutique' feel, prioritizing product imagery and effortless navigation. Suitable for premium furniture, fashion, architecture, or design-focused platforms.

**Style Prompt**:

```
Create a design with a 'Minimalist Editorial' aesthetic. 
- **Typography**: Primary font 'General Sans'. Use font-weight 600 for headings (24px, -0.025em tracking) and product titles (14px). Use font-weight 400 for categories (12px, #64748B).
- **Color Palette**: Backgrounds in #FFFFFF; Secondary surfaces in #F8FAFC; Borders in #F1F5F9; Primary text in #0F172A; Accents in #000000.
- **Shadows & Borders**: Avoid heavy shadows. Use 1px solid borders in #F1F5F9 for headers, footers, and pills.
- **Interactions**: Implement a `duration-700` ease-out transition on image hover (scale: 105%). Use `active:scale-95` for all clickable buttons and pills for tactile feedback.
- **Radius**: Large radius (9999px) for category pills and circular icon buttons; sharp corners (0px) for product images to maintain a professional look.
```

---

### Summary-to-Detail Dashboard

**Slug**: `summary-to-detail-dashboard`

**Tags**: mobile app, home, layout

**Description**: A top-down hierarchy starting with a single primary summary, followed by compact secondary metrics and a detailed breakdown section.

Best Suitable For
Fintech, health tracking, analytics, enterprise SaaS, data-heavy apps.

**Style Prompt**:

```
Apply a dark-mode theme with background #0F1115. Typography: Use 'General Sans' with letter-spacing -0.02em on headings. Primary colors: #2563EB (Primary Blue), #10B981 (Success), #F43F5E (Danger), #8B5CF6 (Accent). Global Card Styles: border-radius of 2rem (32px) for primary hero cards and 1rem (16px) for secondary cards. Glassmorphism: background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08). Animations: Use cubic-bezier(0.4, 0, 0.2, 1) for transitions; active states should include a subtle scale down (0.98). Shadows: Soft blue-tinted shadows for primary elements (e.g., shadow-blue-900/20).
```

---

## Layout Prompts

These define composition patterns, grid systems, and spatial arrangements for your components.

### Mosaic Grid Architecture Style

**Slug**: `mosaic-grid-architecture-style`

**Tags**: neutral, low contrast, forestgreen accent, cream accent, industrial, minimal, saas landing, ai first product, style, landing page

**Description**: An architectural, technical-blueprint style design system featuring a minimalist mosaic grid, forest green (#1A3C2B) and light-gray paper-textured (#F7F7F5) palette. Optimized for B2B SaaS, developer tools, and high-end agency portfolios. Key features include editorial typography with Space Grotesk, JetBrains Mono labels, bento grid layouts, and 2D flat wireframe aesthetics with zero shadows.

**Layout 1**: Untitled

```
Implement a full-page background pattern using an SVG mosaic of interlocking rectangular panels. Panels should have varying sizes (large squares, horizontal strips, vertical blocks) divided by 0.5px hairlines (#3A3A38 at 0.3 opacity). Fill all panels with #F7F7F5. The pattern should repeat seamlessly.
```

**Layout 2**: Untitled

```
Fixed top header with a 1px border-bottom (#3A3A38/20). Left side: square logo box (32x32px) in #1A3C2B with a white icon. Center: Nav links in JetBrains Mono, 10px, uppercase, prefixed with numerical indices (e.g., '01. Pricing'). Right side: Ghost button (1px border) and a solid Forest green button.
```

**Layout 3**: Untitled

```
Large typography layout. Header text 'Space Grotesk' 8xl, tracking-tight, forest green. Subtext in JetBrains Mono, 14px, all-caps, with a vertical 1px line on the left. Include an abstract wireframe graphic on the right: a square container with a dashed circular orbit and a luminosity-blended image.
```

**Layout 4**: Untitled

```
A 2x2 grid layout with a 1px 'Grid' color gap separating the cells. Each cell has a 'Paper' (#F7F7F5) background, 32px padding, and a monospaced header label with a colored left-border accent (Coral, Mint, Gold). Include internal 'mockup' boxes that simulate code snippets or UI errors using monospaced text and flat color chips.
```

**Layout 5**: Untitled

```
A centered 640px wide form box. Background: #F7F7F5, Border: 1px hairline. Add four L-shaped 'corner markers' (10px x 10px) in #1A3C2B at each corner of the container. Form fields use solid white backgrounds with 1px borders and monospaced labels positioned directly above inputs.
```

---

### Analytics dashboard

**Slug**: `analytics-dashboard`

**Tags**: dashboard, analytics dashboard, neutral, blue accent, clean palette, stripe inspired, minimalist, grid based, sass, data visualisation, enterprise software, sidebar navigation, card

**Description**: Professional SaaS analytics dashboard design featuring a clean, enterprise-grade aesthetic. Utilizing a refined blue brand palette (#3B82F6), high-contrast gray scales, and dual-font pairing (Inter for UI, JetBrains Mono for data logs). The layout employs a classic sidebar-and-main-content structure with bento-style metric cards, interactive grouped bar charts, and technical event streams. Ideal for fintech, developer tools, cloud infrastructure monitoring, and complex data-driven enterprise platforms.

**Layout 1**: Untitled

```
Left sidebar (width: 256px), white background, right-border (#E9ECEF). Top section includes a brand logo (32x32px rounded-lg brand blue) and navigation links. Active link: #3B82F6 text on #EFF6FF background. Footer section includes a user profile card with an avatar, name, and role.
```

**Layout 2**: Untitled

```
Horizontal header with a workspace selector (styled dropdown), an 'Operational' status badge (green pill), and a time-range toggle (1D, 7D, 30D, All) styled as a segmented control. Action buttons for 'Filter' and 'Export' with 1px gray borders and icons.
```

**Layout 3**: Untitled

```
A 4-column grid of cards. Each card contains: a title in uppercase 10px bold gray text, a primary metric (30px semibold), a trend indicator (e.g., +12%), and a mini-sparkline or progress bar. Sparklines use #3B82F6 with a stroke-width of 2.
```

**Layout 4**: Untitled

```
A two-column layout (2/3 width chart, 1/3 width side panels). The chart is a 'Grouped Bar Chart' with vertical bars (width: 12px, radius: 2px) comparing API calls (Gray) and Generations (Blue). The right column contains a 'System Alerts' feed and a 'Component Reuse' Donut Chart.
```

**Layout 5**: Untitled

```
A full-width data table inside a white card. Headers: 12px uppercase gray text. Rows feature project name with sub-text metadata, a status badge (pill style), and a progress-bar based 'Efficiency' score. Hover state: Light gray background shift.
```

**Layout 6**: Untitled

```
A code-inspired technical log. Monospace font, light gray background (#F8F9FA), vertical alignment of columns (Timestamp, Method, Path, Request ID). Uses brand blue for successful methods (POST/GET) and red for errors.
```

---

### Linear inspired developer tool dashboard

**Slug**: `linear-inspired-developer-tool-dashboard`

**Tags**: dark mode, linear inspired, minimalist, high contrast, internal tool, status colour syste, dashboard, task driven

**Description**: A high-performance dark-mode console design inspired by Linear and high-end developer tools. Featuring a deep charcoal and black palette (#0e0e0e, #111113) with a vibrant indigo accent (#5e6ad2). The layout uses a classic three-pane structure: a 240px navigation sidebar, a central list view, and a 480px sliding contextual detail panel. Key aesthetics include minimal borders (white/5), Inter/JetBrains Mono typography pairing, glassmorphism overlays, and precise status indicators with subtle animations. Optimized for SaaS dashboards, developer platforms, and AI-driven workflow management tools.

**Layout 1**: Untitled

```
Fixed width of 240px. Background `#111113`, border-right `1px solid rgba(255,255,255,0.05)`. Includes a 48px height workspace switcher at top, a scrollable nav area with category headers (11px uppercase, letter-spacing: wide), and a 48px user profile footer with a 20px circular avatar.
```

**Layout 2**: Untitled

```
48px height. Background `#0e0e0e`, border-bottom `1px solid rgba(255,255,255,0.05)`. Left side contains breadcrumbs (slash separators). Right side contains a 128px width search bar with a shortcut key hint ('F') and a primary 'New' button (white background, black text, 13px font weight).
```

**Layout 3**: Untitled

```
Scrollable area. Items are 44px high rows. Active row has background `rgba(94, 106, 210, 0.05)`. Each row contains: status icon (14px), Mono ID (12px), title (14px), metadata tags (small bordered badges), and a right-aligned timestamp (12px muted text).
```

**Layout 4**: Untitled

```
Fixed width of 480px. Background `#111113`. Slides in from right. Header matches main header height (48px). Content section features 24px padding, divided into: Title/Description block, AI control widgets (enclosed card with 10% white border), property grid (2-column key-value pairs), and a chronological activity feed with vertical connectors.
```

**Layout 5**: Untitled

```
Fixed height 32px at the extreme bottom. Font: 10px Monospace. Displays system status with a pulsing 6px circle, version numbers, and latency stats. Background `#0e0e0e`.
```

---

### Enterprise Admin Platform

**Slug**: `enterprise-admin-platform`

**Tags**: slate colour, high contrast, enterprise software, minimalist, brutalist, grid based, sass, landing page, b2b, admin platform, leads generation

**Description**: Enterprise Admin Platform is a professional, high-trust landing page design for corporate B2B SaaS, fintech, and infrastructure tools. It features a muted corporate color palette (whites, deep slates, and technical blues), a structured grid-based layout, and a focus on operational control and security. Key elements include a high-fidelity dashboard preview, KPI count-up animations, and a glass-morphism navigation bar. Suitable for enterprise management systems, cybersecurity platforms, and developer infrastructure tools.

**Layout 1**: Untitled

```
Fixed header at top, 64px height. Left-aligned logo with a #020617 square icon. Center-aligned nav links (Platform, Solutions, Security) in text-sm font-medium Slate 600. Right-aligned 'Book Demo' button in Slate 900 background with white text.
```

**Layout 2**: Untitled

```
Centered layout with 128px top padding. A pill-shaped badge at the top (#eff6ff) with a pulsing green status dot. Title in 72px bold text-slate-900. Two primary CTAs: a blue primary button with right-arrow icon and a white outline button with play-circle icon. Background features a faint 40px grid overlay.
```

**Layout 3**: Untitled

```
A max-width 1152px container showing a simulated browser window. Include a browser top-bar with three dots and a URL bar. The internal UI consists of a 256px sidebar (Slate 50), a header with system status indicators, a 3-column stats row (e.g., Active Users, API Requests), and a detailed data table. Table rows must show hover states with light blue background (#eff6ff).
```

**Layout 4**: Untitled

```
3-column grid layout for core features. Each card has a 12px radius, light gray border, and a subtle icon in a tinted square box (e.g., Blue for Users, Emerald for Security). On hover, cards transition to white background with a soft shadow (shadow-xl shadow-slate-200/50).
```

**Layout 5**: Untitled

```
Full-width section with background #020617. Features a decorative background of concentric white circles with 10% opacity. Display four major KPIs with a count-up animation script. Numbers in #60a5fa (Primary 400), labels in uppercase Slate 400.
```

**Layout 6**: Untitled

```
Split 2-column layout. Left: Checklist of certifications (SOC2, GDPR) with blue check-circle icons. Right: A 'Policy Toggle' card showing active/inactive switches for security protocols like MFA, IP Whitelisting, and Key Rotation. Include an overlapping 'Threat Blocked' alert card in Slate 800 for depth.
```

**Layout 7**: Untitled

```
6-column structure. Left-most 2 columns for logo, location, and social icons. Remaining 4 columns for Product, Resources, Company, and Legal link lists. Bottom bar includes copyright and a 'System Status' indicator with a green pulsing dot.
```

---

### Modular Card Dashboard

**Slug**: `modular-card-dashboard`

**Tags**: mobile app, home, layout

**Description**: A high-contrast wireframe dashboard style featuring a modular card-based system. Characterized by a 'neubrutalism-lite' aesthetic with heavy black borders, hard shadows on hover, and a strict grayscale palette. It utilizes clean editorial typography (Switzer) and a minimalist approach to data visualization. Perfect for SaaS management tools, fintech mobile apps, developer dashboards, and productivity interfaces where structural clarity and modularity are prioritized over colorful decoration.

**Layout 1**: Untitled

```
Create a sticky header with a background of #F5F5F5 at 90% opacity and a 4px backdrop-blur. Padding: top 56px, sides 24px, bottom 24px. Elements: a vertical stack of a tiny uppercase 'Workspace' label (#6B7280) and a 30px bold 'Dashboard' title. On the right, place a 40x40px circular button with a 1px #111111 border, containing a centered settings icon.
```

**Layout 2**: Untitled

```
A 220px tall featured card. Structure: Header with title and date, a data visualization area, and a status footer. Data Viz: Five vertical bars of varying heights (40% to 85%), using #111111 for the active bar and #F3F4F6 for inactive bars. Footer: A 1px dashed top border separating a tiny status indicator with a 8px green dot.
```

**Layout 3**: Untitled

```
A list of cards with 12px vertical spacing between them. Each card contains: an icon in a 40x40px circular gray-bordered container, text metadata (title/subtitle), a thin 6px progress bar track (#F3F4F6) with a solid fill (#111111), and a bottom row of monospaced secondary text. Include a hidden-by-default grip icon (lucide:grip-vertical) that appears on hover at the right side.
```

**Layout 4**: Untitled

```
A 2-column grid with 12px gaps. Each card is 1:1 aspect ratio or slightly taller. Elements: a 20px icon at the top left, followed by a large 24px bold number and a 12px gray label at the bottom. No hard shadows here; use a subtle #F9FAFB background change on hover.
```

**Layout 5**: Untitled

```
A full-width button (padding 16px) with a 2px dashed border (#D1D5DB). Text: 'Add Widget' in 14px medium weight with a leading plus icon. On hover, the border and text transition to #111111.
```

---

### Bento Configuration Dashboard

**Slug**: `bento-configuration-dashboard`

**Tags**: onboarding, page, light mode, warm colour, neutral, stone colour, teal accent, sass, bento grid, workspace setup, responsible admin dashboard, modern

**Description**: Bento Configuration Dashboard style: A professional, non-linear SaaS onboarding layout using a modular bento grid. Features soft stone-neutral bases with a sophisticated teal accent (#14b8a6). Typography combines Plus Jakarta Sans for headings and Inter for UI elements. Designed for fintech, workspace management, and developer tools. Employs glassmorphism-lite with 20% opacity card tints, inset borders for depth, and smooth cubic-bezier transitions. Includes a circular SVG progress tracker and multi-state setup cards.

**Layout 1**: Untitled

```
Layout: Flex container (row-reverse on mobile, row on desktop). Elements: Left side contains a breadcrumb ('Setup Guide / Workspace'), an H1 with a light-weighted span suffix, and a descriptive paragraph (max-width 512px). Right side contains a circular progress tracker (SVG) with a numeric readout and a button group (link-style 'Skip' and a primary 'Finish Setup' button). Interaction: 'Finish Setup' should remain in a disabled state (bg-stone-200, text-stone-400) until critical tasks are finished.
```

**Layout 2**: Untitled

```
Layout: CSS Grid with 12 columns (`grid-cols-12`) and gap-6. Row heights should be dynamic (`auto-rows-min`). Component Distribution: Card 1 (7 cols), Card 2 (5 cols, 2 rows tall), Card 3 (4 cols), Card 4 (3 cols), Card 5 (3 cols), Card 6 (9 cols). Each section represents a standalone configuration module.
```

**Layout 3**: Untitled

```
Inside each card: 
- **Top Left**: Metadata badges (e.g., 'Recommended' in white/stone or 'Critical' in purple tints) and a clock icon with time estimate (e.g., '2 min').
- **Top Right**: Completion indicator. If done, show a circle-check with #14b8a6 background. If pending, show a 2px stone-200 ring.
- **Content**: Card-specific interactive elements like selectable option tiles, member lists with overlapping avatars, or horizontal toggle buttons.
- **States**: Inactive options should be grayscale (filter: grayscale(1)) and opacity 60%. Active/Selected options use 2px #14b8a6 borders.
```

---

### Glassmorphism HR Dashboard

**Slug**: `glassmorphism-hr-dashboard`

**Description**: A futuristic Glassmorphism HR & Finance dashboard featuring a dark mode aesthetic with vibrant gradients and frosted glass effects. Designed for HR management, salary tracking, and fintech platforms, it utilizes a sophisticated dark indigo background (#0f172a) paired with glowing blue (#667eea) and purple (#764ba2) accents. Key elements include bento-grid layouts, SVG-based data visualizations, smooth staggered animations, and a focus on Arabic RTL typography (Cairo font). It balances high-end visual fidelity with functional information density.

**Layout 1**: Untitled

```
Create a sticky header with a height of 64px. Use a glass-panel background with a bottom border (rgba(255,255,255,0.1)). On the right (RTL), place a logo/brand mark (40x40px, gradient #667eea to #764ba2) with a title and sub-caption. On the left, include a notification bell button and a user profile pill containing an avatar (32px), user name, and role label.
```

**Layout 2**: Untitled

```
Display 4 stat cards in a responsive grid (1 col mobile, 4 cols desktop). Each card has a unique linear gradient background (e.g., #667eea to #764ba2, #f093fb to #f5576c). Include an icon in a frosted glass square (32px), a trend percentage badge, a label, and a large bold metric. Cards should have a hover 'lift' effect.
```

**Layout 3**: Untitled

```
A 2-column grid featuring a 'Donut Chart' on one side and a 'Vertical Bar Chart' on the other. Use glass-panel containers. The donut chart should be an SVG with multiple segments representing statuses. The bar chart should show categorical data with bars that animate from 0 to full height on load. Include a legend with color-coded dots.
```

**Layout 4**: Untitled

```
Full-width glass panel for a 'Monthly Trends' line chart. Include a section header with an icon and a 'Financial' tag. The chart should be an SVG area graph with a linear gradient fill (primary color to transparent) and a stroked line path. Overlay a horizontal grid using rgba(255,255,255,0.05). X-axis labels at the bottom.
```

**Layout 5**: Untitled

```
A glass-panel container housing a clean data table. Columns: Index, Entity (with avatar/icon), Category, Value (monospace font), and Performance (horizontal progress bar). Header row should be slate-400 and 14px. Rows should have a subtle hover background change (rgba(255,255,255,0.05)).
```

---

### HORIZON Minimalist Command Dashboard

**Slug**: `horizon-minimalist-command-dashboard`

**Description**: A high-end minimalist command dashboard designed for venture studios and fintech platforms. Features a dark mode aesthetic using precise OKLCH color spaces, editorial typography (Instrument Sans), and hairline borders (0.5px). Optimized for complex data visualization with a 'Command and Control' feel, utilizing bento grids, subtle backdrop blurs, and micro-interactions like slow-pinging status indicators.

**Layout 1**: Untitled

```
Width: 256px (w-64). Fixed to the left. Border-right: 0.5px `white/5%`. Top section contains a compact logo with a 32px rounded square icon and uppercase subtitle (8px, tracking-widest). Navigation uses 40px height items with 12px icons, active state indicated by a Gold border-left (2px) and a subtle `white/5%` background.
```

**Layout 2**: Untitled

```
Height: 56px (h-14). Backdrop-blur: 12px. Background: Background color at 80% opacity. Right-aligned items including a notification bell with a Coral dot and a 32px circular avatar with a subtle 1px border.
```

**Layout 3**: Untitled

```
Horizontal container with 32px padding (p-8). Divide into 4-5 flex-1 sections using vertical hairline dividers. Each section contains a 10px uppercase label and a 24px semibold value. Right-most section includes a 'Pipeline Health' visualization using 4 small rounded bars (some filled Mint, others low-opacity Mint).
```

**Layout 4**: Untitled

```
Large card with a header containing a title and an 'AI Scout' badge (Gold text on `white/5%` background). Layout: 2/3 width Priority Queue with actionable list items (each with a 6px status dot); 1/3 width AI Insights panel with `white/1%` background and a small horizontal 'Conviction Score' progress bar.
```

**Layout 5**: Untitled

```
3-column grid (on desktop). Cards feature a 32px padding, a progress bar at the bottom with a 'Committed' label, and status badges in the top right (Active, Warmup, Critical). Hover state: border color shifts to Gold at 30% opacity.
```

---

### Card Grid Browse

**Slug**: `card-grid-browse`

**Tags**: mobile app, index, browse, layout

**Description**: A sophisticated, mobile-first product browsing layout emphasizing whitespace, clean typography, and a stable 2-column grid. The design utilizes a monochrome base with slate-toned neutrals to create a high-end 'boutique' feel, prioritizing product imagery and effortless navigation. Suitable for premium furniture, fashion, architecture, or design-focused platforms.

**Layout 1**: Untitled

```
Design a sticky top header with 56px top padding (safe area). Include a title 'Collection' at 24px semi-bold left-aligned, and two 40px circular action buttons (Search, Filter) on the right. Below the title, add a horizontally scrollable (hide-scrollbar) container of category pills. Active pill: Black background, White text. Inactive pill: #F8FAFC background, 1px #F1F5F9 border, #64748B text. All pills should have 10px 20px padding and text-sm font-weight 500.
```

**Layout 2**: Untitled

```
Construct a 2-column grid with a 16px (gap-4) horizontal gap and 32px (gap-8) vertical gap. Each card should contain a 3:4 aspect ratio image container. Images must use `object-cover`. On hover, images scale 5%. Cards must have a title (text-sm, truncated) and price (text-xs, font-medium) on one line, with a secondary category label (#64748B, text-xs) below.
```

**Layout 3**: Untitled

```
Fixed bottom bar at 100% width, #FFFFFF background with a 1px top border (#F1F5F9). Height should accommodate safe area (pb-[34px]). Include 4 equally spaced navigation items consisting of a 20px icon and a 10px font-weight 500 label. Active state: #000000; Inactive state: #94A3B8.
```

---

### Summary-to-Detail Dashboard

**Slug**: `summary-to-detail-dashboard`

**Tags**: mobile app, home, layout

**Description**: A top-down hierarchy starting with a single primary summary, followed by compact secondary metrics and a detailed breakdown section.

Best Suitable For
Fintech, health tracking, analytics, enterprise SaaS, data-heavy apps.

**Layout 1**: Untitled

```
Top-aligned header with 56px height. Left side: Greeting text in gray-400 (sm) and user name in white (xl, semibold). Right side: 40px circular profile image with a 2px emerald green online indicator and 1px white/10% border.
```

**Layout 2**: Untitled

```
Hero card with 32px corner radius and linear-gradient(to-bottom-right, #2563EB, #4338CA). Padding: 24px. Features a large metric (2.75rem font size) with a smaller decimal suffix. Include a 'percentage change' pill using white/20% background and 14px text. Top right: eye icon for visibility toggle.
```

**Layout 3**: Untitled

```
A 2-column grid with 16px (1rem) spacing. Each card uses the 'Glassmorphism' style. Top of card: a 40px circular icon container with 10% opacity background of the icon color. Content: XS gray-400 label followed by XL semibold value. Cards should have an active state scale of 0.98.
```

**Layout 4**: Untitled

```
Vertical list with 4px gap between items. Each item is a 12px rounded-corner row. Left side: 48px square icon with 16px radius (bg-white/5). Middle: Vertical stack with Title (sm, semibold) and Timestamp (xs, gray-500). Right side: Amount (sm, semibold). Row hover state: background rgba(255,255,255, 0.05).
```

**Layout 5**: Untitled

```
Fixed footer with backdrop-filter: blur(20px) and #0F1115/90 background. Contains 5 icons. Center icon is a 'Plus' FAB: 48px circle, #2563EB background, white icon, with a strong blue shadow. Other icons are 24px size, gray-500 default color, active state #2563EB.
```

---

## Component Prompts

These define specific UI primitives and interactive elements.

### Mosaic Grid Architecture Style

**Slug**: `mosaic-grid-architecture-style`

**Tags**: neutral, low contrast, forestgreen accent, cream accent, industrial, minimal, saas landing, ai first product, style, landing page

**Description**: An architectural, technical-blueprint style design system featuring a minimalist mosaic grid, forest green (#1A3C2B) and light-gray paper-textured (#F7F7F5) palette. Optimized for B2B SaaS, developer tools, and high-end agency portfolios. Key features include editorial typography with Space Grotesk, JetBrains Mono labels, bento grid layouts, and 2D flat wireframe aesthetics with zero shadows.

**Component 1**: Untitled

```
Create an inline-flex container with 1px border (#1A3C2B/20). Inside, place a 8px x 8px square dot of solid #1A3C2B followed by JetBrains Mono text at 10px, uppercase, tracking-widest. Padding: 4px 12px.
```

**Component 2**: Untitled

```
A circular container (max-width: 450px) with 1px border. Central 16px solid forest green node. Three orbiting nodes on dashed paths (140px radius). Connect nodes to center using 1px solid lines at 0.2 opacity. Animate orbiting nodes with a linear 20s infinite rotation.
```

**Component 3**: Untitled

```
1px bordered square card. Top: Quote icon and star ratings (5 icons, 10px each). Body: Monospaced text at 12px, line-height 1.6. Bottom: 1px top border with user avatar (square, no radius) and name/title in JetBrains Mono.
```

---

### Analytics dashboard

**Slug**: `analytics-dashboard`

**Tags**: dashboard, analytics dashboard, neutral, blue accent, clean palette, stripe inspired, minimalist, grid based, sass, data visualisation, enterprise software, sidebar navigation, card

**Description**: Professional SaaS analytics dashboard design featuring a clean, enterprise-grade aesthetic. Utilizing a refined blue brand palette (#3B82F6), high-contrast gray scales, and dual-font pairing (Inter for UI, JetBrains Mono for data logs). The layout employs a classic sidebar-and-main-content structure with bento-style metric cards, interactive grouped bar charts, and technical event streams. Ideal for fintech, developer tools, cloud infrastructure monitoring, and complex data-driven enterprise platforms.

**Component 1**: Untitled

```
Render an SVG grouped bar chart. Each group contains two vertical bars: Left bar (API Calls) #E5E7EB, Right bar (Generations) #3B82F6. Bar width: 12px. Corner radius: 2px on top only. Hover effect: Increase color saturation. Background: Dashed horizontal grid lines #E9ECEF.
```

**Component 2**: Untitled

```
A circular donut chart with a stroke width of 12px. Background track: #F1F3F5. Active segment: #3B82F6. Center text: Large bold percentage (e.g., 72%) with a sub-label (SYSTEM) in 10px uppercase gray.
```

**Component 3**: Untitled

```
A container with 1px border #D1D5DB, padding 2px. Buttons inside have no border. The 'active' button has a light gray background #F1F3F5 and a subtle shadow. Non-active buttons have gray text #6B7280 and hover-transition to #111827.
```

---

### Linear inspired developer tool dashboard

**Slug**: `linear-inspired-developer-tool-dashboard`

**Tags**: dark mode, linear inspired, minimalist, high contrast, internal tool, status colour syste, dashboard, task driven

**Description**: A high-performance dark-mode console design inspired by Linear and high-end developer tools. Featuring a deep charcoal and black palette (#0e0e0e, #111113) with a vibrant indigo accent (#5e6ad2). The layout uses a classic three-pane structure: a 240px navigation sidebar, a central list view, and a 480px sliding contextual detail panel. Key aesthetics include minimal borders (white/5), Inter/JetBrains Mono typography pairing, glassmorphism overlays, and precise status indicators with subtle animations. Optimized for SaaS dashboards, developer platforms, and AI-driven workflow management tools.

**Component 1**: Untitled

```
Rectangle with 8px border-radius, border `1px solid rgba(255,255,255,0.1)`. Header includes a bot icon and a pulsing 'Active' status light. Body contains grid rows with 100px fixed-width labels. Includes a custom-styled `<input type="range">` with `#5e6ad2` accent color and small monospace value readouts.
```

**Component 2**: Untitled

```
Positioned absolute bottom-12. Background `#1a1a1a`, 6px border-radius, thin border. Uses `display: flex` with 16px gap. Shortcut keys wrapped in small `#888` background boxes with mono text. Includes a subtle slide-in animation with 0.5s delay.
```

**Component 3**: Untitled

```
Padding 2px 6px. Background `rgba(255,255,255,0.05)`, border `1px solid rgba(255,255,255,0.1)`. Border-radius 4px. Font: 10px JetBrains Mono. Icons inside are 10px.
```

---

### Enterprise Admin Platform

**Slug**: `enterprise-admin-platform`

**Tags**: slate colour, high contrast, enterprise software, minimalist, brutalist, grid based, sass, landing page, b2b, admin platform, leads generation

**Description**: Enterprise Admin Platform is a professional, high-trust landing page design for corporate B2B SaaS, fintech, and infrastructure tools. It features a muted corporate color palette (whites, deep slates, and technical blues), a structured grid-based layout, and a focus on operational control and security. Key elements include a high-fidelity dashboard preview, KPI count-up animations, and a glass-morphism navigation bar. Suitable for enterprise management systems, cybersecurity platforms, and developer infrastructure tools.

**Component 1**: Untitled

```
Use an IntersectionObserver to trigger a 2000ms animation. Use an ease-out quartic function: 1 - Math.pow(1 - progress, 4). Format integers without decimals and percentages to 2 decimal places.
```

**Component 2**: Untitled

```
A table component with sticky header. Rows feature a 0.2s transition-color background on hover. Use status badges: Success (Green-100/800), Warning (Yellow-100/800), Failed (Red-100/800). Time columns must be right-aligned and text-slate-400.
```

**Component 3**: Untitled

```
A 40px width pill-shaped toggle. Track color #2563eb for 'On'. The thumb is a white circle with shadow-sm, positioned 4px from the edge. Include a 'just-in-time' hover effect that slightly glows the track.
```

---

### Modular Card Dashboard

**Slug**: `modular-card-dashboard`

**Tags**: mobile app, home, layout

**Description**: A high-contrast wireframe dashboard style featuring a modular card-based system. Characterized by a 'neubrutalism-lite' aesthetic with heavy black borders, hard shadows on hover, and a strict grayscale palette. It utilizes clean editorial typography (Switzer) and a minimalist approach to data visualization. Perfect for SaaS management tools, fintech mobile apps, developer dashboards, and productivity interfaces where structural clarity and modularity are prioritized over colorful decoration.

**Component 1**: Untitled

```
Component: div; Styles: bg-white, border [1px solid #111], rounded-lg [8px], transition [all 0.2s ease-in-out]; Hover: transform [translateY(-2px)], box-shadow [4px 4px 0px 0px #000000]; Active: transform [translateY(0px)], box-shadow [0px 0px 0px 0px #000000]; Cursor: grab; padding: 20px;
```

**Component 2**: Untitled

```
A flex container with 'items-end' and 'justify-between'. Child elements: Divs with width: 100% and variable heights. Inactive state: bg-[#F3F4F6]. Active/Highlighted state: bg-[#111111]. Rounded corners: 2px (sm).
```

---

### Bento Configuration Dashboard

**Slug**: `bento-configuration-dashboard`

**Tags**: onboarding, page, light mode, warm colour, neutral, stone colour, teal accent, sass, bento grid, workspace setup, responsible admin dashboard, modern

**Description**: Bento Configuration Dashboard style: A professional, non-linear SaaS onboarding layout using a modular bento grid. Features soft stone-neutral bases with a sophisticated teal accent (#14b8a6). Typography combines Plus Jakarta Sans for headings and Inter for UI elements. Designed for fintech, workspace management, and developer tools. Employs glassmorphism-lite with 20% opacity card tints, inset borders for depth, and smooth cubic-bezier transitions. Includes a circular SVG progress tracker and multi-state setup cards.

**Component 1**: Untitled

```
Create an SVG circle with `viewBox='0 0 36 36'`. Background path: stroke #e7e5e4, stroke-width 3. Progress path: stroke #0d9488, stroke-linecap 'round', stroke-dasharray calculated based on completion. Add a subtle `drop-shadow-sm` to the active stroke.
```

**Component 2**: Untitled

```
Small inner cards (border-radius 12px) with white background. States: Default (border-stone-200, grayscale icons), Selected (border-accent-500/30, bg-white, color icons, check-circle icon in top right corner). Includes an icon, bold title, and sub-text.
```

**Component 3**: Untitled

```
A div with `rounded-2xl`, `border border-stone-100`, and `relative` positioning. Inside, place a second absolute-positioned div with `inset-0`, `border`, `rounded-2xl`, and a slightly darker border color (e.g., 200/30) to create a double-stroke effect. Use `transition: all 0.3s` for hover lift.
```

---

### Glassmorphism HR Dashboard

**Slug**: `glassmorphism-hr-dashboard`

**Description**: A futuristic Glassmorphism HR & Finance dashboard featuring a dark mode aesthetic with vibrant gradients and frosted glass effects. Designed for HR management, salary tracking, and fintech platforms, it utilizes a sophisticated dark indigo background (#0f172a) paired with glowing blue (#667eea) and purple (#764ba2) accents. Key elements include bento-grid layouts, SVG-based data visualizations, smooth staggered animations, and a focus on Arabic RTL typography (Cairo font). It balances high-end visual fidelity with functional information density.

**Component 1**: Untitled

```
Create three fixed 500-600px div elements with high z-index (-1). Apply `border-radius: 50%`, `filter: blur(120px)`, and `mix-blend-mode: screen`. Colors: Purple-600/20 and Blue-600/20. Apply a custom 'blob' animation that moves them ±30px and scales them slightly over a 7-second infinite loop.
```

**Component 2**: Untitled

```
A pill-shaped badge with `background: rgba(var(--color), 0.2)`, `border: 1px solid rgba(var(--color), 0.3)`, and `color: var(--color)`. Font size: 10px. Include a tiny Lucide icon (e.g., lock) next to the text.
```

---

### HORIZON Minimalist Command Dashboard

**Slug**: `horizon-minimalist-command-dashboard`

**Description**: A high-end minimalist command dashboard designed for venture studios and fintech platforms. Features a dark mode aesthetic using precise OKLCH color spaces, editorial typography (Instrument Sans), and hairline borders (0.5px). Optimized for complex data visualization with a 'Command and Control' feel, utilizing bento grids, subtle backdrop blurs, and micro-interactions like slow-pinging status indicators.

**Component 1**: Untitled

```
A 8px circular container. Inside, one 8px dot with `animate-ping` at 75% opacity and one 8px static dot, both colored Mint `oklch(0.75 0.18 165)`. Used for 'System Active' signals.
```

**Component 2**: Untitled

```
Full-width 6px height track with `white/5%` background. Inner bar uses Gold `oklch(0.82 0.12 95)` with a smooth transition. Above the bar, use 12px font for 'Committed' status labels.
```

---

### Card Grid Browse

**Slug**: `card-grid-browse`

**Tags**: mobile app, index, browse, layout

**Description**: A sophisticated, mobile-first product browsing layout emphasizing whitespace, clean typography, and a stable 2-column grid. The design utilizes a monochrome base with slate-toned neutrals to create a high-end 'boutique' feel, prioritizing product imagery and effortless navigation. Suitable for premium furniture, fashion, architecture, or design-focused platforms.

**Component 1**: Untitled

```
A 40px circular button with a 'sliders-horizontal' icon. Add a 8px solid black dot (#000000) positioned at top: 10px, right: 10px to indicate active filters.
```

**Component 2**: Untitled

```
Small rectangular badges positioned top-left of the image container. Text: 10px uppercase bold. 'NEW' badge: Black background/White text. 'SALE' badge: Red background (#EF4444)/White text. Padding: 4px 8px.
```

---

### Summary-to-Detail Dashboard

**Slug**: `summary-to-detail-dashboard`

**Tags**: mobile app, home, layout

**Description**: A top-down hierarchy starting with a single primary summary, followed by compact secondary metrics and a detailed breakdown section.

Best Suitable For
Fintech, health tracking, analytics, enterprise SaaS, data-heavy apps.

**Component 1**: Untitled

```
Construct a card with background `rgba(30, 41, 59, 0.4)`, `backdrop-filter: blur(12px)`, and `border: 1px solid rgba(255, 255, 255, 0.08)`. Border-radius: 16px. Padding: 16px. Include a hover/active state that scales the card to 0.98 and increases the brightness of the inner icon.
```

**Component 2**: Untitled

```
Layout: Horizontal flexbox with `justify-between` and `items-center`. Icon container: 48px x 48px with `border-radius: 12px`. Title: `font-size: 14px`, `font-weight: 600`. Amount: `font-size: 14px`, `font-weight: 600`. Hover state triggers a background change to `white/5` and scales the internal icon by 1.05x using `transition: transform 0.2s ease`.
```

---

## Recommended Theme Combinations

### For AgentPing Dashboard

**Primary Style**: `linear-inspired-developer-tool-dashboard`
- Clean, minimal, developer-focused aesthetic
- Excellent for technical tools and dashboards

**Layout System**: `modular-card-dashboard` or `bento-configuration-dashboard`
- Flexible card-based compositions
- Great for dynamic data displays

**Component Library**: `glassmorphism-hr-dashboard`
- Modern glassmorphic elements
- Elevated, premium feel

**Special Features**: `mosaic-grid-architecture-style`
- Asymmetric, architectural layouts
- High visual interest

---

### For SaaS Marketing/Landing

**Primary Style**: `zen-design-dashboard`
- Calm, professional, trustworthy
- Perfect for B2B SaaS

**Layout System**: `summary-to-detail-dashboard`
- Progressive disclosure patterns
- Information hierarchy built-in

**Component Library**: `neon-edge-or-cinematic-dashboard`
- Eye-catching accents
- Modern, forward-thinking

---

### For Analytics/Data Tools

**Primary Style**: `analytics-dashboard`
- Data-first design language
- Clear information hierarchy

**Layout System**: `card-grid-browse`
- Scannable, browsable layouts
- Excellent for data exploration

**Component Library**: `neumorphictradedashboard`
- Subtle depth and shadows
- Professional, modern aesthetic

---

### For Enterprise Admin Platforms

**Primary Style**: `enterprise-admin-platform`
- Professional, scalable design system
- Built for complex workflows

**Layout System**: `fedmindy-or-empire-command-dashboard`
- Command-center aesthetic
- Dense information displays

**Component Library**: `horizon-minimalist-command-dashboard`
- Clean, functional components
- Minimal cognitive load

---

## Usage Notes

1. **Mixing Styles**: You can combine style prompts with layout prompts from different themes
2. **Customization**: All prompts can be adjusted for your brand colors and requirements
3. **Component Reuse**: Extract component prompts and use across different layouts
4. **Responsive**: Most prompts include mobile-responsive considerations

## Next Steps

- Extract specific color palettes from style prompts
- Build component library based on selected theme combination
- Create design system documentation from chosen prompts
- Implement GenUI runtime with these as template bases


