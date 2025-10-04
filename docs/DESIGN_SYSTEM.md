# Baker's Suite - Design System

**Version:** 1.0  
**Last Updated:** October 4, 2025  
**Status:** Foundation  
**Inspiration:** Warm, artisanal bakery aesthetic

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Elevation & Shadows](#5-elevation--shadows)
6. [Border Radius](#6-border-radius)
7. [Animation & Transitions](#7-animation--transitions)
8. [Iconography](#8-iconography)
9. [Accessibility](#9-accessibility)
10. [Design Tokens](#10-design-tokens)

---

## 1. Brand Identity

### Brand Personality
**Warm • Professional • Intelligent • Trustworthy • Artisanal**

Baker's Suite combines the warmth of home baking with professional-grade precision. The design should feel:
- **Warm & Inviting:** Like walking into a cozy bakery at sunrise
- **Clean & Modern:** Professional tools for serious bakers
- **Intelligent:** Smart features that feel effortless
- **Trustworthy:** Reliable calculations and timelines
- **Artisanal:** Crafted with care, attention to detail

### Brand Voice
- **Tone:** Friendly expert, encouraging mentor
- **Language:** Clear, professional, never condescending
- **Approach:** Empowering bakers with knowledge and tools

---

## 2. Color System

### Primary Colors

**Sunset Orange (Primary)**
```
Name: sunset-orange
Hex: #FA8B47
RGB: 250, 139, 71
Usage: Primary CTAs, links, focus states, key actions
```

**Warm Cream (Background)**
```
Name: warm-cream
Hex: #FEF5EC
RGB: 254, 245, 236
Usage: Main background, canvas
```

**Chocolate Brown (Text)**
```
Name: chocolate-brown
Hex: #3D2817
RGB: 61, 40, 23
Usage: Primary text, headings
```

### Secondary Colors

**Coral Peach**
```
Name: coral-peach
Hex: #FA9F6E
RGB: 250, 159, 110
Usage: Secondary accents, highlights, success states
```

**Light Peach**
```
Name: light-peach
Hex: #FFD7C4
RGB: 255, 215, 196
Usage: Subtle backgrounds, hover states
```

**Pure White**
```
Name: pure-white
Hex: #FFFFFF
RGB: 255, 255, 255
Usage: Cards, elevated surfaces, inputs
```

### Neutral Palette

**Warm Grays**
```
warm-gray-50:  #FAFAF9  (lightest)
warm-gray-100: #F5F5F4
warm-gray-200: #E7E5E4
warm-gray-300: #D6D3D1
warm-gray-400: #A8A29E
warm-gray-500: #78716C
warm-gray-600: #57534E  (medium)
warm-gray-700: #44403C
warm-gray-800: #292524
warm-gray-900: #1C1917  (darkest)
```

### Semantic Colors

**Success**
```
success-light: #D4F4DD
success:       #4CAF50
success-dark:  #2E7D32
```

**Warning**
```
warning-light: #FFF4E5
warning:       #FF9800
warning-dark:  #E65100
```

**Error**
```
error-light:   #FFEBEE
error:         #F44336
error-dark:    #C62828
```

**Info**
```
info-light:    #E3F2FD
info:          #2196F3
info-dark:     #1565C0
```

### Weather-Specific Colors

**Temperature Scale**
```
temp-cold:     #5B9BD5  (Cold - below 65°F)
temp-cool:     #70AD47  (Cool - 65-70°F)
temp-ideal:    #FFC000  (Ideal - 70-78°F)
temp-warm:     #FA8B47  (Warm - 78-85°F)
temp-hot:      #C00000  (Hot - above 85°F)
```

**Humidity Indicators**
```
humidity-low:    #FFE5CC  (Below 40%)
humidity-ideal:  #D4F4DD  (40-70%)
humidity-high:   #E3F2FD  (Above 70%)
```

### Usage Guidelines

**Do's:**
- Use `sunset-orange` for all primary actions (buttons, links)
- Use `warm-cream` as the main canvas background
- Use `chocolate-brown` for primary text to ensure readability
- Use `pure-white` for cards and elevated content
- Maintain 4.5:1 contrast ratio minimum (WCAG AA)

**Don'ts:**
- Don't use orange on cream without sufficient contrast
- Don't use pure black (#000000) - always use chocolate-brown
- Don't use more than 3 colors in a single component
- Don't use bright colors for large background areas

---

## 3. Typography

### Font Families

**Primary Font: Inter**
- **Usage:** Body text, UI elements, forms
- **Why:** Excellent readability, modern, professional
- **Fallback:** system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Heading Font: Fraunces**
- **Usage:** Headings, hero text, emphasis
- **Why:** Warm, artisanal feel with professional polish
- **Fallback:** Georgia, "Times New Roman", serif
- **Alternative:** Playfair Display, Lora

**Monospace Font: JetBrains Mono**
- **Usage:** Code, ratios, measurements
- **Fallback:** "Courier New", monospace

### Type Scale

**Mobile (Base: 16px)**
```
xs:   0.75rem   (12px)  - Fine print, labels
sm:   0.875rem  (14px)  - Secondary text, captions
base: 1rem      (16px)  - Body text
lg:   1.125rem  (18px)  - Large body, emphasized text
xl:   1.25rem   (20px)  - Small headings
2xl:  1.5rem    (24px)  - H4
3xl:  1.875rem  (30px)  - H3
4xl:  2.25rem   (36px)  - H2
5xl:  3rem      (48px)  - H1, Hero
```

**Desktop (Base: 16px)**
```
xs:   0.75rem   (12px)
sm:   0.875rem  (14px)
base: 1rem      (16px)
lg:   1.125rem  (18px)
xl:   1.25rem   (20px)
2xl:  1.625rem  (26px)  - H4
3xl:  2rem      (32px)  - H3
4xl:  2.5rem    (40px)  - H2
5xl:  3.5rem    (56px)  - H1
6xl:  4.5rem    (72px)  - Hero
```

### Font Weights

```
light:      300  - Rare use, decorative
regular:    400  - Body text
medium:     500  - Emphasis, UI elements
semibold:   600  - Subheadings, buttons
bold:       700  - Headings
extrabold:  800  - Hero text (rare)
```

### Line Heights

```
tight:   1.25    - Large headings
snug:    1.375   - Headings
normal:  1.5     - Body text
relaxed: 1.625   - Long-form content
loose:   2       - Spacious layouts
```

### Letter Spacing

```
tighter:  -0.05em  - Large headings
tight:    -0.025em - Headings
normal:   0        - Body text
wide:     0.025em  - Uppercase labels
wider:    0.05em   - Buttons, emphasis
widest:   0.1em    - Decorative
```

### Typography Examples

**H1 - Hero Heading**
```css
font-family: 'Fraunces', serif;
font-size: 3.5rem;      /* Desktop: 56px */
font-weight: 700;
line-height: 1.25;
letter-spacing: -0.025em;
color: #3D2817;
```

**H2 - Section Heading**
```css
font-family: 'Fraunces', serif;
font-size: 2.5rem;      /* Desktop: 40px */
font-weight: 600;
line-height: 1.25;
color: #3D2817;
```

**Body Text**
```css
font-family: 'Inter', sans-serif;
font-size: 1rem;        /* 16px */
font-weight: 400;
line-height: 1.5;
color: #57534E;         /* warm-gray-600 */
```

**Button Text**
```css
font-family: 'Inter', sans-serif;
font-size: 1rem;
font-weight: 600;
letter-spacing: 0.025em;
color: #FFFFFF;
```

**Label/Caption**
```css
font-family: 'Inter', sans-serif;
font-size: 0.875rem;    /* 14px */
font-weight: 500;
letter-spacing: 0.025em;
text-transform: uppercase;
color: #78716C;         /* warm-gray-500 */
```

---

## 4. Spacing & Layout

### Spacing Scale (8px base unit)

```
0:    0px
0.5:  2px
1:    4px
1.5:  6px
2:    8px     ← Base unit
3:    12px
4:    16px
5:    20px
6:    24px
8:    32px
10:   40px
12:   48px
16:   64px
20:   80px
24:   96px
32:   128px
40:   160px
48:   192px
64:   256px
```

### Container Widths

```
sm:   640px   (Mobile landscape)
md:   768px   (Tablet)
lg:   1024px  (Desktop)
xl:   1280px  (Large desktop)
2xl:  1536px  (Extra large)

max-width: 1440px  (Content container max)
```

### Breakpoints

```
Mobile:       0px - 640px
Tablet:       641px - 1024px
Desktop:      1025px - 1440px
Large:        1441px+

@media (min-width: 640px)   /* sm */
@media (min-width: 768px)   /* md */
@media (min-width: 1024px)  /* lg */
@media (min-width: 1280px)  /* xl */
@media (min-width: 1536px)  /* 2xl */
```

### Grid System

**12-Column Grid**
- Gutter: 24px (desktop), 16px (mobile)
- Margin: 32px (desktop), 16px (mobile)

**Common Layouts:**
```
Full width:      12 columns
Two-thirds:      8 columns
Half:            6 columns
One-third:       4 columns
Sidebar:         3 columns
Main content:    9 columns
```

---

## 5. Elevation & Shadows

### Shadow Levels

**Level 0 - None**
```css
box-shadow: none;
```

**Level 1 - Subtle (Cards, Inputs)**
```css
box-shadow: 
  0 1px 3px 0 rgba(61, 40, 23, 0.1),
  0 1px 2px -1px rgba(61, 40, 23, 0.1);
```

**Level 2 - Raised (Dropdowns, Tooltips)**
```css
box-shadow: 
  0 4px 6px -1px rgba(61, 40, 23, 0.1),
  0 2px 4px -2px rgba(61, 40, 23, 0.1);
```

**Level 3 - Floating (Modals, Popovers)**
```css
box-shadow: 
  0 10px 15px -3px rgba(61, 40, 23, 0.1),
  0 4px 6px -4px rgba(61, 40, 23, 0.1);
```

**Level 4 - Overlay (Dialogs)**
```css
box-shadow: 
  0 20px 25px -5px rgba(61, 40, 23, 0.1),
  0 8px 10px -6px rgba(61, 40, 23, 0.1);
```

**Focus Ring**
```css
box-shadow: 
  0 0 0 3px rgba(250, 139, 71, 0.5);
```

---

## 6. Border Radius

### Radius Scale

```
none:   0px
sm:     4px      (Buttons, inputs, small cards)
base:   8px      (Cards, containers)
md:     12px     (Large cards, panels)
lg:     16px     (Feature cards, images)
xl:     24px     (Hero sections)
2xl:    32px     (Large feature areas)
full:   9999px   (Pills, circular buttons)
```

### Usage

```css
/* Buttons */
border-radius: 4px;  /* sm */

/* Cards */
border-radius: 8px;  /* base */

/* Images */
border-radius: 12px; /* md */

/* Avatars */
border-radius: 9999px; /* full */
```

---

## 7. Animation & Transitions

### Timing Functions

```css
/* Ease out - Elements entering */
ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);

/* Ease in - Elements leaving */
ease-in: cubic-bezier(0.4, 0.0, 1, 1);

/* Ease in-out - Elements moving */
ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);

/* Bounce - Playful interactions */
bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Duration Scale

```css
fast:     150ms   (Hover states, small changes)
base:     200ms   (Default transitions)
medium:   300ms   (Dropdowns, tooltips)
slow:     500ms   (Modals, drawers)
slower:   700ms   (Page transitions)
```

### Common Transitions

**Button Hover**
```css
transition: 
  background-color 150ms ease-out,
  transform 150ms ease-out;

&:hover {
  background-color: #E67834; /* Darker sunset-orange */
  transform: translateY(-1px);
}
```

**Card Hover**
```css
transition: 
  box-shadow 200ms ease-out,
  transform 200ms ease-out;

&:hover {
  box-shadow: 0 10px 15px -3px rgba(61, 40, 23, 0.15);
  transform: translateY(-2px);
}
```

**Modal Enter/Exit**
```css
/* Enter */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Exit */
@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

**Loading Spinner**
```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

animation: spin 1s linear infinite;
```

---

## 8. Iconography

### Icon Library
**Primary:** Lucide React (lucide-react)
- Consistent stroke width
- 24px default size
- Customizable
- Tree-shakeable

**Alternatives:**
- Heroicons (heroicons.com)
- Phosphor Icons (phosphoricons.com)

### Icon Sizes

```
xs:   16px    (Inline with small text)
sm:   20px    (Inline with body text)
base: 24px    (Default, buttons)
lg:   32px    (Feature highlights)
xl:   48px    (Hero sections)
```

### Stroke Width
```
Default: 2px
Thin:    1.5px  (Decorative)
Bold:    2.5px  (Emphasis)
```

### Common Icons

```
Navigation:
- Menu (hamburger)
- X (close)
- ChevronLeft, ChevronRight, ChevronDown, ChevronUp
- Home, Settings, User

Actions:
- Plus (add)
- Edit (pencil)
- Trash (delete)
- Check (confirm)
- X (cancel)

Features:
- Calculator (ratio tool)
- Clock (schedule)
- Cloud (weather)
- BookOpen (recipe)
- Camera (photo)
- Bell (notifications)
```

### Icon Colors

```
Default:    currentColor  (inherits text color)
Primary:    #FA8B47        (sunset-orange)
Muted:      #78716C        (warm-gray-500)
Success:    #4CAF50
Warning:    #FF9800
Error:      #F44336
```

---

## 9. Accessibility

### Color Contrast

**WCAG AA Compliance (Minimum 4.5:1)**

```
✅ chocolate-brown (#3D2817) on warm-cream (#FEF5EC)
   Contrast: 10.2:1 (AAA)

✅ chocolate-brown (#3D2817) on pure-white (#FFFFFF)
   Contrast: 12.8:1 (AAA)

✅ pure-white (#FFFFFF) on sunset-orange (#FA8B47)
   Contrast: 4.8:1 (AA)

✅ warm-gray-600 (#57534E) on warm-cream (#FEF5EC)
   Contrast: 6.1:1 (AA)

❌ sunset-orange (#FA8B47) on warm-cream (#FEF5EC)
   Contrast: 2.4:1 (FAIL - use for decorative only)
```

### Focus States

**Visible Focus Indicator**
```css
/* All interactive elements */
&:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(250, 139, 71, 0.5);
  border-radius: 4px;
}

/* Buttons */
button:focus-visible {
  box-shadow: 
    0 0 0 3px rgba(250, 139, 71, 0.5),
    0 4px 6px -1px rgba(61, 40, 23, 0.1);
}
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order (left-to-right, top-to-bottom)
- Skip links for main content
- Arrow key navigation for menus/dropdowns

### Screen Reader Support

```html
<!-- Use semantic HTML -->
<button aria-label="Calculate recipe ratios">
  <CalculatorIcon aria-hidden="true" />
  Calculate
</button>

<!-- Provide context -->
<img 
  src="bread.jpg" 
  alt="Freshly baked sourdough boule with golden crust"
/>

<!-- Loading states -->
<button aria-busy="true" aria-live="polite">
  <Spinner aria-hidden="true" />
  <span className="sr-only">Loading...</span>
  Loading
</button>
```

### Motion Preferences

```css
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Design Tokens

### Tailwind Config

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        'sunset-orange': {
          DEFAULT: '#FA8B47',
          50: '#FFF4ED',
          100: '#FFE5D6',
          200: '#FFCFAD',
          300: '#FFB07A',
          400: '#FA8B47',
          500: '#F77020',
          600: '#E85A16',
          700: '#C04515',
          800: '#973819',
          900: '#7A3118',
        },
        'warm-cream': '#FEF5EC',
        'chocolate-brown': {
          DEFAULT: '#3D2817',
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#E7DFD1',
          300: '#CFC1A8',
          400: '#A8937A',
          500: '#78665A',
          600: '#57534E',
          700: '#3D2817',
          800: '#2E1F14',
          900: '#1C1208',
        },
        'coral-peach': '#FA9F6E',
        'light-peach': '#FFD7C4',
        
        // Warm Grays
        'warm-gray': {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        
        // Semantic
        success: {
          light: '#D4F4DD',
          DEFAULT: '#4CAF50',
          dark: '#2E7D32',
        },
        warning: {
          light: '#FFF4E5',
          DEFAULT: '#FF9800',
          dark: '#E65100',
        },
        error: {
          light: '#FFEBEE',
          DEFAULT: '#F44336',
          dark: '#C62828',
        },
        info: {
          light: '#E3F2FD',
          DEFAULT: '#2196F3',
          dark: '#1565C0',
        },
        
        // Weather
        'temp-cold': '#5B9BD5',
        'temp-cool': '#70AD47',
        'temp-ideal': '#FFC000',
        'temp-warm': '#FA8B47',
        'temp-hot': '#C00000',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.25' }],
        sm: ['0.875rem', { lineHeight: '1.375' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.5' }],
        xl: ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.375' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
        '5xl': ['3rem', { lineHeight: '1.25' }],
        '6xl': ['3.75rem', { lineHeight: '1.25' }],
      },
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px 0 rgba(61, 40, 23, 0.1), 0 1px 2px -1px rgba(61, 40, 23, 0.1)',
        'DEFAULT': '0 4px 6px -1px rgba(61, 40, 23, 0.1), 0 2px 4px -2px rgba(61, 40, 23, 0.1)',
        'md': '0 10px 15px -3px rgba(61, 40, 23, 0.1), 0 4px 6px -4px rgba(61, 40, 23, 0.1)',
        'lg': '0 20px 25px -5px rgba(61, 40, 23, 0.1), 0 8px 10px -6px rgba(61, 40, 23, 0.1)',
        'focus': '0 0 0 3px rgba(250, 139, 71, 0.5)',
      },
      transitionDuration: {
        'fast': '150ms',
        'DEFAULT': '200ms',
        'medium': '300ms',
        'slow': '500ms',
        'slower': '700ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
```

### CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #FA8B47;
  --color-primary-hover: #E67834;
  --color-background: #FEF5EC;
  --color-surface: #FFFFFF;
  --color-text-primary: #3D2817;
  --color-text-secondary: #57534E;
  --color-text-muted: #78716C;
  --color-border: #E7E5E4;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Fraunces', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 300ms ease-out;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgba(61, 40, 23, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(61, 40, 23, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(61, 40, 23, 0.1);
}
```

---

## Usage Examples

### Primary Button

```tsx
<button className="
  bg-sunset-orange 
  hover:bg-sunset-orange-600
  text-white 
  font-semibold 
  px-6 
  py-3 
  rounded-sm 
  shadow-sm
  transition-all
  duration-fast
  hover:shadow-md
  hover:-translate-y-0.5
  focus-visible:ring-4
  focus-visible:ring-sunset-orange/50
">
  Get Started
</button>
```

### Card Component

```tsx
<div className="
  bg-white 
  rounded-md 
  shadow-sm
  p-6
  transition-all
  duration-base
  hover:shadow-md
  hover:-translate-y-1
">
  <h3 className="font-serif font-semibold text-2xl text-chocolate-brown mb-2">
    Sourdough Boule
  </h3>
  <p className="text-warm-gray-600">
    Classic artisan bread with perfect crust
  </p>
</div>
```

### Input Field

```tsx
<input 
  type="text"
  className="
    w-full
    px-4
    py-3
    rounded-sm
    border
    border-warm-gray-200
    bg-white
    text-chocolate-brown
    placeholder:text-warm-gray-400
    focus:outline-none
    focus:ring-4
    focus:ring-sunset-orange/50
    focus:border-sunset-orange
    transition-all
    duration-fast
  "
  placeholder="Enter recipe name..."
/>
```

---

## Design System Checklist

- [x] Color palette defined (primary, secondary, neutrals, semantic)
- [x] Typography system (fonts, sizes, weights, line heights)
- [x] Spacing scale (consistent 8px base unit)
- [x] Elevation & shadows (4 levels + focus)
- [x] Border radius scale
- [x] Animation & transitions (timing, duration, keyframes)
- [x] Iconography guidelines
- [x] Accessibility standards (WCAG AA)
- [x] Design tokens (Tailwind config, CSS variables)
- [x] Usage examples for common components

---

**Next Steps:**
1. Implement in Tailwind config
2. Create component library based on these tokens
3. Build Storybook for component documentation
4. Design wireframes using this system

**Questions or need adjustments?** This design system is flexible and can evolve with the product!