---
name: Wilderness Narrative
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#434842'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#737972'
  outline-variant: '#c3c8c0'
  surface-tint: '#4d6451'
  primary: '#162c1c'
  on-primary: '#ffffff'
  primary-container: '#2c4231'
  on-primary-container: '#95ae98'
  inverse-primary: '#b3cdb6'
  secondary: '#a23f0a'
  on-secondary: '#ffffff'
  secondary-container: '#fe844d'
  on-secondary-container: '#6b2500'
  tertiary: '#352505'
  on-tertiary: '#ffffff'
  tertiary-container: '#4d3a19'
  on-tertiary-container: '#bfa47a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe9d1'
  primary-fixed-dim: '#b3cdb6'
  on-primary-fixed: '#0a2011'
  on-primary-fixed-variant: '#364c3a'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb597'
  on-secondary-fixed: '#360f00'
  on-secondary-fixed-variant: '#7e2c00'
  tertiary-fixed: '#fcdeb0'
  tertiary-fixed-dim: '#dfc296'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#574421'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 80px
    fontWeight: '800'
    lineHeight: 90px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  overlap-sm: -16px
  overlap-md: -40px
---

## Brand & Style

The design system is rooted in the "Organic Adventurous" aesthetic, blending the tactile warmth of outdoor exploration with high-end editorial sophistication. It targets modern explorers who value authenticity, raw nature, and structured storytelling.

The visual style is a hybrid of **Brutalism** and **Tactile Minimalism**. It utilizes heavy, deliberate borders and offset shadows to create a "physical" interface that feels like a scrapbook or a field journal. The interface favors intentional asymmetry, overlapping layers, and illustrative flourishes (like leaf and mountain motifs) to break the rigidity of digital grids, evoking a sense of discovery and non-linear exploration.

## Colors

The palette is inspired by old-growth forests and sun-baked earth.

*   **Primary (Forest Green):** Used for deep backgrounds, heavy typography, and primary brand indicators. It represents stability and the natural world.
*   **Secondary (Rust Orange):** An action color used for primary buttons, highlighted text, and urgent UI elements. It provides a sharp contrast to the green, reminiscent of high-visibility outdoor gear.
*   **Tertiary (Sand/Beige):** Used for cards, secondary buttons, and tonal shifts in the background.
*   **Neutral (Off-White):** The canvas color. It is never pure white (#FFFFFF), maintaining a soft, paper-like texture that reduces eye strain and feels more organic.

## Typography

Typography acts as a structural element. 

*   **Headlines:** Use **Epilogue** for its bold, geometric, yet slightly quirky character. High-level headers should often be rendered in uppercase or with heavy weights to anchor the page.
*   **Body:** **Work Sans** provides exceptional legibility for long-form storytelling and expedition details.
*   **Technical Labels:** **Space Grotesk** is used for metadata, tags (e.g., "7 DAYS"), and small functional labels to add a subtle technical/navigation feel.

Special Treatment: "Hanging" headlines or text that overlaps image containers should maintain high contrast using the primary or neutral palettes.

## Layout & Spacing

This design system uses an **Asymmetric Fluid Grid**. While content generally adheres to a 12-column structure on desktop, elements are encouraged to "break" the grid using negative margins and overlapping placements.

*   **Overlapping:** Images and text containers should frequently overlap (e.g., a card floating 40px over a section transition).
*   **Collage Arrangement:** Grouped images should vary in aspect ratio and rotation (1-3 degrees) to mimic physical photographs scattered on a desk.
*   **Responsive Reflow:** On mobile, the asymmetry simplifies into a single-column stack, but "Polaroid" style borders and offset shadows are maintained to preserve the brand character.

## Elevation & Depth

Depth is not created via realistic lighting, but through **Structural Layering**:

1.  **Hard Shadows:** Elements use high-opacity, zero-blur shadows offset to the bottom-right (e.g., `4px 4px 0px #2C4231`). This creates a "cut-out" or "sticker" look.
2.  **Object Borders:** All primary containers (cards, search bars, inputs) feature a solid 1px or 2px border in the Primary color.
3.  **The "Polaroid" Frame:** Images are frequently housed in containers with thick white/off-white bottom margins, often featuring a slight rotation.
4.  **Tonal Stacking:** Using the Rust or Sand colors as "shadow blocks" behind primary containers to lift them off the page.

## Shapes

The shape language is primarily **Soft-Geometric**. 

*   **Corners:** Use a standard 4px (`0.25rem`) radius for most components to soften the Brutalist influence without becoming "bubbly."
*   **Irregularity:** Use "organic" masks for decorative icons or large background shapes (e.g., leaf-shaped cutouts).
*   **The Jagged Edge:** Section dividers may use a "torn paper" or zigzag SVG separator to reinforce the adventurous, scrapbooked theme.

## Components

*   **Buttons:** 
    *   *Primary:* Solid Rust background, neutral text, hard Primary-colored shadow.
    *   *Secondary:* Transparent background, Primary border, "ghost" hover state.
*   **Expedition Cards:** Full-bleed image at the top with a "Metadata Bar" overlay (e.g., "7 Days" in a secondary-colored flag). The bottom text area is off-white with a hard border.
*   **Input Fields:** Minimalist. A single bottom border or a full-stroke box with a label positioned in `label-caps` typography above the field.
*   **Chips/Tags:** Small, rectangular boxes with `0.25rem` radius and `Space Grotesk` text. Active states use a solid Primary fill.
*   **Polaroid Frames:** Images with a white border (thickest at the bottom) and a subtle 2-degree rotation. Often includes a handwritten-style caption or metadata.
*   **Iconography:** Linear, mid-weight stroke icons that feel hand-drawn or inspired by national park signage.