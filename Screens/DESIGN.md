---
name: Sonic Dark
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bccbb9'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#869585'
  outline-variant: '#3d4a3d'
  surface-tint: '#53e076'
  primary: '#53e076'
  on-primary: '#003914'
  primary-container: '#1db954'
  on-primary-container: '#004118'
  inverse-primary: '#006e2d'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#ffb3b3'
  on-tertiary: '#680114'
  tertiary-container: '#ff767b'
  on-tertiary-container: '#730a1b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#72fe8f'
  primary-fixed-dim: '#53e076'
  on-primary-fixed: '#002108'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#ffdad9'
  tertiary-fixed-dim: '#ffb3b3'
  on-tertiary-fixed: '#400009'
  on-tertiary-fixed-variant: '#881d28'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: '0'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system is built for immersive, high-energy digital experiences where content—specifically media and imagery—takes center stage. The aesthetic is heavily influenced by **Modern Minimalism** with a focus on dark-mode immersion. 

The brand personality is energetic, rhythmic, and confident. By utilizing a deep, near-black foundation, we eliminate visual noise, allowing the vibrant primary accents to guide the user's journey. The emotional response is one of focus and "flow state," mimicking the experience of a dark theater or a late-night studio session. The style is strictly flat, rejecting simulated depth like shadows or glassmorphism in favor of distinct tonal layering and high-contrast interactions.

## Colors

The palette is optimized for low-light environments and high legibility. 

- **Primary:** A vibrant, saturated green used exclusively for calls-to-action, active states, and essential brand moments. 
- **Base:** The background is a consistent #121212 to ensure true black levels on OLED screens.
- **Surfaces:** Depth is communicated through tonal shifts rather than shadows. `#181818` is used for secondary containers or cards, while `#282828` is reserved for elevated interactive elements like hover states or headers.
- **Typography:** Pure white is used for headings to provide maximum contrast. A muted grey (`#B3B3B3`) is applied to secondary metadata and body text to reduce eye strain and establish a clear information hierarchy.

## Typography

The design system uses **Plus Jakarta Sans** to achieve a contemporary, geometric feel that remains highly readable at small sizes. 

- **Display & Headlines:** Use heavy weights (700-800) with slight negative letter spacing to create a compact, impactful look.
- **Body:** Set at a medium weight (500) to ensure the text doesn't feel "thin" against the dark background.
- **Labels:** Small labels utilize all-caps and increased letter spacing to differentiate them from body content.
- **Responsive Note:** On mobile devices, display type scales down aggressively to prevent awkward line breaks, maintaining the rhythmic density of the layout.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model based on an 8px spacing system, with a 4px "half-step" for tight component internals.

- **Desktop:** A 12-column grid with 24px gutters. Sidebars are typically fixed-width (240px-320px) while the main content area remains fluid.
- **Mobile:** A 4-column grid with 16px margins.
- **Spacing Rhythm:** Use `lg` (24px) for spacing between major sections and `md` (16px) for internal card padding. Elements should feel grouped through proximity, using whitespace to define boundaries rather than lines.

## Elevation & Depth

This design system avoids drop shadows entirely. Depth is achieved through **Tonal Layering**:

1.  **Level 0 (Base):** `#121212` - The canvas.
2.  **Level 1 (Surface):** `#181818` - Cards, sidebars, and navigation bars.
3.  **Level 2 (Active/Hover):** `#282828` - Indicates interactivity or elevation on top of Level 1 surfaces.

For visual separation between overlapping elements (like menus), use a 1px solid border in a slightly lighter gray (`#3E3E3E`) instead of a shadow.

## Shapes

The shape language is defined by extreme roundedness to contrast with the rigid grid.

- **Buttons:** Always use `rounded-full` (pill-shaped) for a friendly, "squishy" feel.
- **Cards & Containers:** Use `rounded-lg` (16px) for primary content containers to soften the dark UI.
- **Avatars:** Strictly circular for people/artists; `rounded-md` (8px) for albums/playlists to maintain the "record sleeve" metaphor.

## Components

- **Buttons:** The primary button is a pill-shaped Spotify Green (`#1DB954`) container with black text. Hover states should slightly increase brightness or scale (1.05x). Secondary buttons are ghost-style with a white border.
- **Chips:** Small, pill-shaped filters using the `#282828` surface color. Active chips switch to the primary green.
- **Lists:** Rows should have a subtle background color change to `#282828` on hover. Include a "play" icon that appears on the far left of the row only during hover.
- **Input Fields:** Rectangular with rounded corners (8px), using `#3E3E3E` as the background. On focus, the border turns white.
- **Cards:** Simple containers with `rounded-lg` corners. On hover, the entire card background shifts to a lighter gray to signify clickability.
- **Progress Bars:** Use a thin grey line for the track and the primary green for the progress fill. The "thumb" or handle should only appear on hover.