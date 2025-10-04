# Baker's Suite - Wireframes

**Version:** 1.0  
**Last Updated:** October 4, 2025  
**Status:** Design Foundation

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Dashboard](#2-dashboard)
3. [Ratio Calculator](#3-ratio-calculator)
4. [Schedule Optimizer](#4-schedule-optimizer)
5. [Flavor Pairing](#5-flavor-pairing)
6. [Recipe Management](#6-recipe-management)
7. [Baking Journal](#7-baking-journal)
8. [Starter Tracker](#8-starter-tracker)
9. [Settings](#9-settings)
10. [Mobile Views](#10-mobile-views)

---

## Design Principles

- **Mobile-First:** Design for mobile, enhance for desktop
- **Content Hierarchy:** Most important actions/info prominent
- **White Space:** Generous spacing for breathing room
- **Scannable:** Quick to understand at a glance
- **Accessible:** WCAG AA compliant, keyboard navigable

---

## 1. Authentication

### 1.1 Landing Page (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [🍞 Baker's Suite Logo]    Home  Features  Pricing    [Sign In]│
│                                                          [Get Started]│
│                                                                  │
│         ┌────────────────────────────────┐                      │
│         │                                │                      │
│         │  The Intelligent Baking        │    [Image: Fresh    │
│         │  Companion for Serious         │     sourdough       │
│         │  Home Bakers                   │     boule with      │
│         │                                │     scoring]        │
│         │  Achieve professional          │                     │
│         │  consistency with ratio-       │                     │
│         │  perfect recipes, weather-     │                     │
│         │  smart timelines, and flavor   │                     │
│         │  discovery.                    │                     │
│         │                                │                     │
│         │  [Get Started Free →]          │                     │
│         │   No credit card required      │                     │
│         │                                │                     │
│         └────────────────────────────────┘                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Trusted by 1,000+ Bakers                │  │
│  │                                                            │  │
│  │   [☁️]          [📊]           [🎨]                       │  │
│  │   Weather       Ratio          Flavor                     │  │
│  │   Intelligence  Calculator     Pairing                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 Sign Up

```
┌─────────────────────────────────────┐
│                                     │
│       🍞 Baker's Suite              │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Create Your Account        │   │
│   │                             │   │
│   │  [────────────────────]     │   │
│   │   Email                     │   │
│   │                             │   │
│   │  [────────────────────]     │   │
│   │   Password                  │   │
│   │                             │   │
│   │  [ ] I agree to Terms       │   │
│   │                             │   │
│   │  [   Sign Up with Email  ]  │   │
│   │                             │   │
│   │  ─── or continue with ───   │   │
│   │                             │   │
│   │  [🔵 Continue with Google]  │   │
│   │  [🍎 Continue with Apple ]  │   │
│   │                             │   │
│   │  Already have an account?   │   │
│   │  Sign In                    │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 2. Dashboard

### 2.1 Main Dashboard (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🍞 Baker's Suite        🏠 Dashboard  📊 Recipes  ⏰ Timelines    [👤 ▾] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Good morning, Sarah! ☀️                                   📍 San Francisco│
│  Perfect baking weather today • 72°F • 55% humidity                     │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    🎯 Active Bakes                              │   │
│  │                                                                 │   │
│  │  ┌──────────────────────────────┐  ┌────────────────────────┐  │   │
│  │  │ 🥖 Sourdough Boule           │  │ 🥐 Croissants          │  │   │
│  │  │                              │  │                        │  │   │
│  │  │ 📍 Bulk fermentation         │  │ 📍 Final proof         │  │   │
│  │  │ ⏰ Fold in 45 minutes         │  │ ⏰ Bake in 2 hours     │  │   │
│  │  │                              │  │                        │  │   │
│  │  │ [View Timeline →]            │  │ [View Timeline →]      │  │   │
│  │  └──────────────────────────────┘  └────────────────────────┘  │   │
│  │                                                                 │   │
│  │  [+ Start New Bake]                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌───────────────────┐  ┌───────────────────┐  ┌──────────────────┐   │
│  │ 🧮 Quick Tools    │  │ 📔 Recent Journal │  │ 🥖 My Starter    │   │
│  │                   │  │                   │  │                  │   │
│  │ [Ratio Calculator]│  │ ⭐⭐⭐⭐⭐          │  │ Levain           │   │
│  │ [Flavor Pairing]  │  │ Perfect crumb!    │  │ Fed 8 hours ago  │   │
│  │ [Schedule Maker]  │  │ Yesterday         │  │ ✅ Healthy       │   │
│  │                   │  │                   │  │                  │   │
│  │                   │  │ ⭐⭐⭐⭐☆          │  │ [Feed Now]       │   │
│  │                   │  │ Good oven spring  │  │                  │   │
│  │                   │  │ 3 days ago        │  │                  │   │
│  └───────────────────┘  └───────────────────┘  └──────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Weather Widget (Expanded)

```
┌────────────────────────────────────────┐
│  ☀️ Today's Baking Conditions          │
│                                        │
│  📍 San Francisco, CA                  │
│  Updated 5 minutes ago                 │
│                                        │
│  ┌────────────────────────────────┐   │
│  │                                │   │
│  │     72°F                       │   │
│  │     ════════════ Ideal         │   │
│  │     60°   70°   80°            │   │
│  │                                │   │
│  │     55% Humidity               │   │
│  │     ════════════ Perfect       │   │
│  │     40%   60%   80%            │   │
│  │                                │   │
│  │     29.9" Pressure             │   │
│  │     Stable                     │   │
│  │                                │   │
│  └────────────────────────────────┘   │
│                                        │
│  💡 Recommendations:                   │
│  • Standard hydration (70%)            │
│  • Normal proofing times               │
│  • Excellent day for high-hydration    │
│    doughs                              │
│                                        │
└────────────────────────────────────────┘
```

---

## 3. Ratio Calculator

### 3.1 Ratio Calculator Interface

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🍞 Baker's Suite                              🧮 Ratio Calculator         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📝 Recipe Information                                          │   │
│  │                                                                 │   │
│  │  Recipe Name: [Sourdough Boule                              ]   │   │
│  │  Recipe Type: [Sourdough          ▾]                            │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔢 Ingredients (Baker's Percentages)                          │   │
│  │                                                                 │   │
│  │  ┌─────────────┬──────────┬───────┬──────────────┐            │   │
│  │  │ Ingredient  │ Weight   │ Unit  │ Percentage   │            │   │
│  │  ├─────────────┼──────────┼───────┼──────────────┤            │   │
│  │  │ Flour       │ [500  ]  │ [g▾]  │ 100%    ━━━━ │            │   │
│  │  │ Water       │ [350  ]  │ [g▾]  │ 70%     ━━━━ │            │   │
│  │  │ Salt        │ [10   ]  │ [g▾]  │ 2%      ━━━━ │            │   │
│  │  │ Starter     │ [100  ]  │ [g▾]  │ 20%     ━━━━ │            │   │
│  │  │             │          │       │              │            │   │
│  │  │ [+ Add Ingredient]                           │            │   │
│  │  └─────────────┴──────────┴───────┴──────────────┘            │   │
│  │                                                                 │   │
│  │  Total Dough Weight: 960g                                       │   │
│  │  Hydration: 70%                                                 │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📏 Scale Recipe                                                │   │
│  │                                                                 │   │
│  │  Scale by:  ( ) Flour Weight   (•) Final Yield   ( ) Percentage│   │
│  │                                                                 │   │
│  │  I want: [1500]g final dough weight                            │   │
│  │                                                                 │   │
│  │  [Calculate Scaled Recipe]                                      │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📊 Scaled Results                                              │   │
│  │                                                                 │   │
│  │  Flour:    781g  (100%)                                         │   │
│  │  Water:    547g  (70%)                                          │   │
│  │  Salt:     16g   (2%)                                           │   │
│  │  Starter:  156g  (20%)                                          │   │
│  │  ────────────────────                                           │   │
│  │  Total:    1,500g                                               │   │
│  │                                                                 │   │
│  │  [Save Recipe]  [Create Timeline]  [Export]                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Unit Converter (Popup)

```
┌────────────────────────────────┐
│  ⚖️ Unit Converter              │
│                                │
│  Convert:                      │
│  [500     ] [g  ▾]             │
│                                │
│  To:                           │
│  [17.6    ] [oz ▾]             │
│  [2.2     ] [cups▾]            │
│  [1.1     ] [lb ▾]             │
│                                │
│  [Insert]  [Cancel]            │
└────────────────────────────────┘
```

---

## 4. Schedule Optimizer

### 4.1 Timeline Creation

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🍞 Baker's Suite                           ⏰ Schedule Optimizer          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📅 When do you want your bread ready?                          │   │
│  │                                                                 │   │
│  │  ┌────────────────┐  ┌──────────────┐                          │   │
│  │  │ Date           │  │ Time         │                          │   │
│  │  │ [12/15/2024 ▾] │  │ [06:00 PM ▾] │                          │   │
│  │  └────────────────┘  └──────────────┘                          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🥖 Select Recipe                                               │   │
│  │                                                                 │   │
│  │  [Sourdough Boule                                          ▾]   │   │
│  │                                                                 │   │
│  │  Or [Create New Recipe →]                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🌡️ Current Conditions                                          │   │
│  │                                                                 │   │
│  │  Temperature: 72°F  (Ideal)                                     │   │
│  │  Humidity:    55%   (Perfect)                                   │   │
│  │                                                                 │   │
│  │  ☑️ Auto-adjust timeline based on weather                       │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ⚙️ Advanced Options                                            │   │
│  │                                                                 │   │
│  │  Room Temperature:  [72]°F                                      │   │
│  │  Retard Option:     [None              ▾]                       │   │
│  │  Starter Readiness: [Peak (4-6 hours)  ▾]                       │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  [Generate Timeline]                                                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Timeline View (Gantt-style)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🍞 Sourdough Boule Timeline                    Ready: Dec 15, 6:00 PM    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ☀️ Weather adjusted: +15 min (warmer than usual)                       │
│                                                                          │
│  Timeline (18 hours total)                         [Pause] [Export] [×] │
│                                                                          │
│  Dec 15                                                                  │
│  12am  2am   4am   6am   8am   10am  12pm  2pm   4pm   6pm   8pm   10pm │
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤  │
│  │                       │                         │                    │
│  │                       ↓                         ↓                    │
│  │                    START                      FINISH                 │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ ✅ 12:00 AM - Feed Starter                                     │    │
│  │    └─ Mix 50g starter + 50g flour + 50g water                  │    │
│  │    └─ 🔔 Notification sent                                     │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ ⏳ 6:00 AM - Autolyse (In 2 hours)                             │    │
│  │    └─ Mix flour + water, rest 30 min                           │    │
│  │    └─ 🔔 Set reminder                                          │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │    6:30 AM - Mix Dough                                          │    │
│  │    └─ Add starter + salt, mix thoroughly                        │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │    7:00 AM - 2:00 PM - Bulk Fermentation (7 hours)             │    │
│  │    ├─ 8:00 AM - Fold #1 (Coil fold)                            │    │
│  │    ├─ 9:00 AM - Fold #2 (Coil fold)                            │    │
│  │    ├─ 10:00 AM - Fold #3 (Coil fold)                           │    │
│  │    └─ 11:00 AM - Fold #4 (Coil fold, final)                    │    │
│  │    🌡️ 72°F = normal fermentation                               │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │    2:00 PM - Pre-shape                                          │    │
│  │    └─ Gentle shaping, bench rest 20 min                         │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │    2:20 PM - Final Shape                                        │    │
│  │    └─ Shape into boule, place in banneton                       │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │    2:30 PM - 5:15 PM - Final Proof (2h 45m)                    │    │
│  │    └─ Proof at room temp until poke test ready                  │    │
│  │    🌡️ +15 min weather adjustment applied                       │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │    5:15 PM - Preheat Oven                                       │    │
│  │    └─ Preheat to 500°F with Dutch oven inside                   │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │    5:45 PM - Score & Bake                                       │    │
│  │    └─ Score bread, bake 20 min covered, 25 min uncovered        │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │    6:30 PM - Cool & Enjoy! 🎉                                   │    │
│  │    └─ Cool on rack at least 1 hour before slicing               │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  [Save Timeline]  [Start Baking]  [Share]                               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Flavor Pairing

### 5.1 Flavor Pairing Explorer

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🍞 Baker's Suite                             🎨 Flavor Pairing Explorer   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔍 Find Flavor Pairings                                        │   │
│  │                                                                 │   │
│  │  Base Ingredients:                                              │   │
│  │  ┌───────────────────────────────────────────────────────┐     │   │
│  │  │ [chocolate]  [×]  [orange]  [×]  [+ Add ingredient]   │     │   │
│  │  └───────────────────────────────────────────────────────┘     │   │
│  │                                                                 │   │
│  │  Filter by:                                                     │   │
│  │  [All ▾]  [Sweet]  [Savory]  [Breakfast]  [Dessert]           │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  💡 Suggested Pairings                                          │   │
│  │                                                                 │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐            │   │
│  │  │ 🌰 Hazelnut          │  │ 🫐 Raspberry         │            │   │
│  │  │                      │  │                      │            │   │
│  │  │ Confidence: 95%      │  │ Confidence: 88%      │            │   │
│  │  │ ⭐⭐⭐⭐⭐             │  │ ⭐⭐⭐⭐☆             │            │   │
│  │  │                      │  │                      │            │   │
│  │  │ Shared compounds:    │  │ Shared compounds:    │            │   │
│  │  │ • Vanillin          │  │ • Fruity esters     │            │   │
│  │  │ • Nutty aldehydes   │  │ • Tartaric acid     │            │   │
│  │  │                      │  │                      │            │   │
│  │  │ [View Details]       │  │ [View Details]       │            │   │
│  │  └──────────────────────┘  └──────────────────────┘            │   │
│  │                                                                 │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐            │   │
│  │  │ ☕ Coffee            │  │ 🧂 Sea Salt          │            │   │
│  │  │                      │  │                      │            │   │
│  │  │ Confidence: 92%      │  │ Confidence: 85%      │            │   │
│  │  │ ⭐⭐⭐⭐⭐             │  │ ⭐⭐⭐⭐☆             │            │   │
│  │  │                      │  │                      │            │   │
│  │  │ Shared compounds:    │  │ Enhancement:         │            │   │
│  │  │ • Roasted notes     │  │ • Amplifies         │            │   │
│  │  │ • Bitter compounds  │  │   chocolate notes   │            │   │
│  │  │                      │  │ • Balances sweet    │            │   │
│  │  │ [View Details]       │  │ [View Details]       │            │   │
│  │  └──────────────────────┘  └──────────────────────┘            │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🕸️ Flavor Network                         [Expand ⛶]          │   │
│  │                                                                 │   │
│  │                    Hazelnut                                     │   │
│  │                      / \                                        │   │
│  │                     /   \                                       │   │
│  │                    /     \                                      │   │
│  │            Chocolate ─── Orange                                 │   │
│  │                 \       /   \                                   │   │
│  │                  \     /     \                                  │   │
│  │                   \   /       \                                 │   │
│  │                  Coffee     Raspberry                           │   │
│  │                                                                 │   │
│  │  Click nodes to explore connections                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Pairing Detail View

```
┌────────────────────────────────────────────┐
│  Chocolate + Orange                        │
│                                            │
│  Confidence: 95% ⭐⭐⭐⭐⭐                  │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │  Why They Work Together            │   │
│  │                                    │   │
│  │  Shared Flavor Compounds:          │   │
│  │  • Limonene (citrus)              │   │
│  │  • Vanillin (sweet)               │   │
│  │  • Terpenes (aromatic)            │   │
│  │                                    │   │
│  │  Flavor Profile:                   │   │
│  │  Dark chocolate's bitter notes     │   │
│  │  are brightened by orange's        │   │
│  │  acidity and citrus oils.          │   │
│  └────────────────────────────────────┘   │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │  Recipe Suggestions                │   │
│  │                                    │   │
│  │  • Chocolate Orange Babka          │   │
│  │  • Dark Chocolate Orange Scones    │   │
│  │  • Orange Zest Brownies            │   │
│  │                                    │   │
│  │  [View All Recipes →]              │   │
│  └────────────────────────────────────┘   │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │  Cuisine Traditions                │   │
│  │                                    │   │
│  │  🇲🇽 Mexican (Mole sauce)          │   │
│  │  🇬🇧 British (Terry's)             │   │
│  │  🇮🇹 Italian (Panettone)           │   │
│  └────────────────────────────────────┘   │
│                                            │
│  [💾 Save Pairing]  [🔗 Share]  [Close]   │
└────────────────────────────────────────────┘
```

---

## 6. Recipe Management

### 6.1 Recipe Library

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🍞 Baker's Suite                                    📚 My Recipes         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔍 [Search recipes...]                              [+ New Recipe]      │
│                                                                          │
│  Filter: [All ▾]  [Sourdough]  [Quick Bread]  [Pastry]  [Favorites]    │
│  Sort by: [Recently Added ▾]                                            │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  My Recipes (8/10 - Free Tier)                                  │   │
│  │                                                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │   │
│  │  │ [Image]      │  │ [Image]      │  │ [Image]      │         │   │
│  │  │              │  │              │  │              │         │   │
│  │  │ Sourdough    │  │ Baguettes    │  │ Focaccia     │         │   │
│  │  │ Boule        │  │              │  │              │         │   │
│  │  │              │  │              │  │              │         │   │
│  │  │ 70% Hydro    │  │ 75% Hydro    │  │ 80% Hydro    │         │   │
│  │  │ ⭐⭐⭐⭐⭐     │  │ ⭐⭐⭐⭐☆     │  │ ⭐⭐⭐⭐⭐     │         │   │
│  │  │              │  │              │  │              │         │   │
│  │  │ [Edit] [⋮]   │  │ [Edit] [⋮]   │  │ [Edit] [⋮]   │         │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │   │
│  │                                                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │   │
│  │  │ [Image]      │  │ [Image]      │  │ [Image]      │         │   │
│  │  │              │  │              │  │              │         │   │
│  │  │ Croissants   │  │ Brioche      │  │ Ciabatta     │         │   │
│  │  │              │  │              │  │              │         │   │
│  │  │ Laminated    │  │ Enriched     │  │ 85% Hydro    │         │   │
│  │  │ ⭐⭐⭐⭐☆     │  │ ⭐⭐⭐⭐⭐     │  │ ⭐⭐⭐☆☆     │         │   │
│  │  │              │  │              │  │              │         │   │
│  │  │ [Edit] [⋮]   │  │ [Edit] [⋮]   │  │ [Edit] [⋮]   │         │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘         │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📥 Import Recipe                                               │   │
│  │                                                                 │   │
│  │  Paste URL: [https://...]                          [Import]    │   │
│  │  Or [Upload Photo] of cookbook recipe                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Recipe Detail View

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ← Back to Recipes                                                   [⋮]  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐                                               │
│  │                      │   Sourdough Boule                             │
│  │   [Recipe Photo]     │                                               │
│  │                      │   Classic artisan sourdough with              │
│  │                      │   perfect crust and open crumb                │
│  └──────────────────────┘                                               │
│                                                                          │
│  [⭐ 4.8] 12 bakes     #sourdough #artisan                              │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📊 Recipe Stats                                                │   │
│  │                                                                 │   │
│  │  Hydration:    70%                                              │   │
│  │  Total Time:   18 hours                                         │   │
│  │  Active Time:  1 hour                                           │   │
│  │  Difficulty:   Intermediate                                     │   │
│  │  Yield:        1 large boule (~800g)                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔢 Ingredients (Baker's Percentages)                          │   │
│  │                                                                 │   │
│  │  Bread Flour       500g   (100%)                                │   │
│  │  Water            350g   (70%)                                  │   │
│  │  Salt              10g   (2%)                                   │   │
│  │  Starter          100g   (20%)                                  │   │
│  │                                                                 │   │
│  │  [Scale Recipe →]                                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📝 Instructions                                                │   │
│  │                                                                 │   │
│  │  1. Autolyse (30 min)                                           │   │
│  │     Mix flour + water, rest covered                             │   │
│  │                                                                 │   │
│  │  2. Mix (15 min)                                                │   │
│  │     Add starter + salt, mix until combined                      │   │
│  │                                                                 │   │
│  │  3. Bulk Fermentation (6-8 hours)                              │   │
│  │     4 sets of coil folds, 30 min apart                         │   │
│  │                                                                 │   │
│  │  4. Pre-shape (20 min rest)                                     │   │
│  │     Gentle shaping, bench rest                                  │   │
│  │                                                                 │   │
│  │  5. Final Shape                                                 │   │
│  │     Shape into boule, proof in banneton                         │   │
│  │                                                                 │   │
│  │  6. Final Proof (2-3 hours)                                     │   │
│  │     Until poke test shows readiness                             │   │
│  │                                                                 │   │
│  │  7. Bake (45 min)                                               │   │
│  │     500°F: 20 min covered, 25 min uncovered                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  [📅 Create Timeline]  [🧮 Ratio Calculator]  [📤 Share]  [❤️ Favorite]│
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Baking Journal

### 7.1 Journal List

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🍞 Baker's Suite                                    📔 Baking Journal     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔍 [Search bakes...]                                [+ Log New Bake]    │
│                                                                          │
│  Filter: [All Recipes ▾]  [⭐ 4+ Stars]  [Issues]     Sort: [Recent ▾]  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Recent Bakes                                                   │   │
│  │                                                                 │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │ [Photo]    Sourdough Boule              Dec 10, 2024       │ │   │
│  │  │            ⭐⭐⭐⭐⭐                                         │ │   │
│  │  │                                                           │ │   │
│  │  │            Perfect crumb! Best one yet.                   │ │   │
│  │  │                                                           │ │   │
│  │  │            Weather: 72°F, 55% humidity                    │ │   │
│  │  │            [View Details →]                               │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │ [Photo]    Baguettes                    Dec 8, 2024        │ │   │
│  │  │            ⭐⭐⭐⭐☆                                         │ │   │
│  │  │                                                           │ │   │
│  │  │            Good oven spring, slightly dense               │ │   │
│  │  │            Issues: #dense-crumb                           │ │   │
│  │  │                                                           │ │   │
│  │  │            Weather: 68°F, 62% humidity                    │ │   │
│  │  │            [View Details →]                               │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │ [Photo]    Focaccia                     Dec 5, 2024        │ │   │
│  │  │            ⭐⭐⭐⭐⭐                                         │ │   │
│  │  │                                                           │ │   │
│  │  │            Amazing texture, perfect seasoning!            │ │   │
│  │  │                                                           │ │   │
│  │  │            Weather: 70°F, 58% humidity                    │ │   │
│  │  │            [View Details →]                               │ │   │
│  │  └───────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📊 Your Baking Stats                                           │   │
│  │                                                                 │   │
│  │  Total Bakes:      24                                           │   │
│  │  Average Rating:   4.3 ⭐                                        │   │
│  │  Current Streak:   5 days 🔥                                    │   │
│  │  Most Baked:       Sourdough Boule (8 times)                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Log New Bake

```
┌────────────────────────────────────────┐
│  📔 Log Your Bake                      │
│                                        │
│  Recipe:                               │
│  [Sourdough Boule               ▾]     │
│                                        │
│  ┌──────────────────────────────┐     │
│  │  📸 Add Photo                │     │
│  │                              │     │
│  │      [+]                     │     │
│  │   Upload Photo               │     │
│  │                              │     │
│  └──────────────────────────────┘     │
│                                        │
│  Rating:                               │
│  [⭐][⭐][⭐][⭐][☆]                     │
│                                        │
│  Notes:                                │
│  ┌──────────────────────────────┐     │
│  │ Perfect crumb structure!     │     │
│  │ Great oven spring.           │     │
│  │                              │     │
│  └──────────────────────────────┘     │
│                                        │
│  Issues (optional):                    │
│  [ ] Dense crumb                       │
│  [ ] Over-proofed                      │
│  [ ] Under-proofed                     │
│  [ ] Burnt bottom                      │
│  [ ] Pale crust                        │
│  [✓] None - Perfect!                   │
│                                        │
│  Weather:                              │
│  Auto-logged: 72°F, 55% humidity       │
│                                        │
│  [Save Bake]  [Cancel]                 │
└────────────────────────────────────────┘
```

---

## 8. Starter Tracker

### 8.1 Starter Dashboard

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🍞 Baker's Suite                                🥖 Starter Tracker        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  My Starter: "Levain"                                           │   │
│  │                                                                 │   │
│  │  ┌──────────┐                                                   │   │
│  │  │          │  Age: 146 days                                    │   │
│  │  │  [Photo] │  Fed: 8 hours ago                                 │   │
│  │  │          │  Health: ✅ Active & Healthy                       │   │
│  │  │          │  Ratio: 1:1:1 (starter:flour:water)               │   │
│  │  └──────────┘  Flour Type: Bread Flour                          │   │
│  │                                                                 │   │
│  │  [Feed Now]  [View History]  [Discard Recipes]                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📅 Feeding Schedule                                            │   │
│  │                                                                 │   │
│  │  Frequency: Every 12 hours                                      │   │
│  │  Next Feed: Today at 8:00 PM                                    │   │
│  │                                                                 │   │
│  │  🔔 Reminders: ON                                               │   │
│  │     ├─ 30 min before                                            │   │
│  │     └─ At feeding time                                          │   │
│  │                                                                 │   │
│  │  [Adjust Schedule]                                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📈 Activity Chart (Last 7 Days)                                │   │
│  │                                                                 │   │
│  │  Rise Height (cm)                                               │   │
│  │  12 ┤                                    ╭──╮                   │   │
│  │  10 ┤                          ╭──╮     │  │                   │   │
│  │   8 ┤                ╭──╮     │  │     │  │                   │   │
│  │   6 ┤      ╭──╮     │  │     │  ╰──╮  ╰──╯                   │   │
│  │   4 ┤╭──╮ │  │     │  ╰──╮ │  │                              │   │
│  │   2 ┤│  ╰──╯  ╰──╮ ╰──╯                                        │   │
│  │   0 ┴────────────────────────────────────────                  │   │
│  │     Mon Tue Wed Thu Fri Sat Sun                                │   │
│  │                                                                 │   │
│  │  💡 Your starter peaks at 6-8 hours consistently               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🗑️ Discard Management                                          │   │
│  │                                                                 │   │
│  │  Available Discard: ~150g                                       │   │
│  │                                                                 │   │
│  │  Recipe Suggestions:                                            │   │
│  │  • Discard Crackers (uses 150g)                                │   │
│  │  • Pancakes (uses 100g)                                        │   │
│  │  • Pizza Dough (uses 200g - need more)                         │   │
│  │                                                                 │   │
│  │  [View All Discard Recipes →]                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Log Feeding

```
┌────────────────────────────────────────┐
│  🥖 Log Starter Feeding                │
│                                        │
│  Starter: Levain                       │
│                                        │
│  Feeding Ratio:                        │
│  ( ) 1:1:1 (maintenance)               │
│  (•) 1:2:2 (before baking)             │
│  ( ) 1:3:3 (strong feed)               │
│  ( ) Custom                            │
│                                        │
│  Amounts:                              │
│  Starter:  [50 ]g                      │
│  Flour:    [100]g                      │
│  Water:    [100]g                      │
│                                        │
│  Observations:                         │
│  ┌──────────────────────────────┐     │
│  │ Very active, lots of         │     │
│  │ bubbles. Peak in 6 hours.    │     │
│  │                              │     │
│  └──────────────────────────────┘     │
│                                        │
│  ┌──────────────────────────────┐     │
│  │  📸 Photo (optional)         │     │
│  │      [+] Upload              │     │
│  └──────────────────────────────┘     │
│                                        │
│  Rise Height (optional):               │
│  Started: [___] cm                     │
│  Peak:    [___] cm                     │
│                                        │
│  [Save Feeding]  [Cancel]              │
└────────────────────────────────────────┘
```

---

## 9. Settings

### 9.1 Settings Page

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🍞 Baker's Suite                                    ⚙️ Settings           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  👤 Profile                                                      │   │
│  │                                                                 │   │
│  │  [Avatar]  Sarah Thompson                                        │   │
│  │            sarah@email.com                                       │   │
│  │                                                                 │   │
│  │  [Edit Profile]                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📍 Location & Weather                                          │   │
│  │                                                                 │   │
│  │  Location: [San Francisco, CA         ]  [Update]              │   │
│  │  Auto-detect: [✓]                                               │   │
│  │                                                                 │   │
│  │  Default Kitchen Temp: [72]°F                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📏 Units & Preferences                                         │   │
│  │                                                                 │   │
│  │  Weight:      (•) Metric (g)    ( ) Imperial (oz)              │   │
│  │  Temperature: ( ) Celsius       (•) Fahrenheit                  │   │
│  │  Time:        (•) 12-hour       ( ) 24-hour                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔔 Notifications                                               │   │
│  │                                                                 │   │
│  │  Timeline Reminders:     [✓] Push  [✓] Email                   │   │
│  │  Starter Feeding:        [✓] Push  [ ] Email                   │   │
│  │  Weather Alerts:         [✓] Push  [ ] Email                   │   │
│  │  Weekly Summary:         [ ] Push  [✓] Email                   │   │
│  │                                                                 │   │
│  │  [Test Notification]                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  💎 Subscription                                                │   │
│  │                                                                 │   │
│  │  Current Plan: Free (8/10 recipes used)                         │   │
│  │                                                                 │   │
│  │  [Upgrade to Premium] - Unlock unlimited recipes, advanced     │   │
│  │   weather learning, and more!                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔒 Privacy & Data                                              │   │
│  │                                                                 │   │
│  │  [Export My Data]                                                │   │
│  │  [Delete Account]                                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Mobile Views

### 10.1 Mobile Dashboard

```
┌─────────────────────┐
│ ☰  Baker's Suite  🔔│
├─────────────────────┤
│                     │
│ Good morning! ☀️    │
│ Perfect baking day  │
│ 72°F • 55% humidity │
│                     │
│ ┌─────────────────┐ │
│ │ 🥖 Sourdough    │ │
│ │                 │ │
│ │ 📍 Bulk ferm.   │ │
│ │ ⏰ Fold in 45min│ │
│ │                 │ │
│ │ [View Timeline] │ │
│ └─────────────────┘ │
│                     │
│ [+ Start New Bake]  │
│                     │
│ ┌─────────────────┐ │
│ │ 🧮 Quick Tools  │ │
│ │                 │ │
│ │ • Calculator    │ │
│ │ • Flavor Pair   │ │
│ │ • Schedule      │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ 🥖 My Starter   │ │
│ │                 │ │
│ │ Levain          │ │
│ │ Fed 8h ago      │ │
│ │ ✅ Healthy      │ │
│ │                 │ │
│ │ [Feed Now]      │ │
│ └─────────────────┘ │
│                     │
└─────────────────────┘
```

### 10.2 Mobile Navigation

```
┌─────────────────────┐
│                     │
│  [Drawer opened]    │
│                     │
│  Sarah T.           │
│  sarah@email.com    │
│  ─────────────────  │
│                     │
│  🏠 Dashboard       │
│  📊 Recipes         │
│  ⏰ Timelines       │
│  📔 Journal         │
│  🥖 Starter         │
│  ─────────────────  │
│  ⚙️ Settings        │
│  💎 Upgrade         │
│  ❓ Help            │
│  🚪 Sign Out        │
│                     │
└─────────────────────┘
```

### 10.3 Mobile Ratio Calculator (Compact)

```
┌─────────────────────┐
│ ← Ratio Calculator  │
├─────────────────────┤
│                     │
│ Recipe Name:        │
│ [Sourdough      ]   │
│                     │
│ Ingredients:        │
│ ┌─────────────────┐ │
│ │ Flour           │ │
│ │ [500]g   100%   │ │
│ │                 │ │
│ │ Water           │ │
│ │ [350]g    70%   │ │
│ │                 │ │
│ │ Salt            │ │
│ │ [10 ]g     2%   │ │
│ │                 │ │
│ │ Starter         │ │
│ │ [100]g    20%   │ │
│ └─────────────────┘ │
│                     │
│ [+ Add More]        │
│                     │
│ Total: 960g         │
│ Hydration: 70%      │
│                     │
│ ┌─────────────────┐ │
│ │ Scale Recipe    │ │
│ │                 │ │
│ │ I want: [1500]g │ │
│ │                 │ │
│ │ [Calculate]     │ │
│ └─────────────────┘ │
│                     │
└─────────────────────┘
```

### 10.4 Mobile Timeline (Vertical)

```
┌─────────────────────┐
│ ← Sourdough Boule   │
├─────────────────────┤
│                     │
│ Ready: Dec 15, 6PM  │
│                     │
│ ━━━━━━━━━━━━━━━━━━━ │
│                     │
│ ✅ 12:00 AM         │
│ Feed Starter        │
│                     │
│ ⏳ 6:00 AM          │
│ Autolyse (In 2h)    │
│ [Remind Me]         │
│                     │
│ ⏳ 6:30 AM          │
│ Mix Dough           │
│                     │
│ ⏳ 7:00 AM          │
│ Start Bulk Ferm     │
│ • Fold at 8am       │
│ • Fold at 9am       │
│ • Fold at 10am      │
│ • Fold at 11am      │
│                     │
│ ⏳ 2:00 PM          │
│ Pre-shape           │
│                     │
│ [View All Steps]    │
│                     │
│ [Pause] [Export]    │
│                     │
└─────────────────────┘
```

---

## Responsive Breakpoints

```
Mobile (Portrait):   320px - 640px
Mobile (Landscape):  641px - 768px
Tablet:              769px - 1024px
Desktop:             1025px - 1440px
Large Desktop:       1441px+
```

---

## Component States

### Button States
```
Default:  [Get Started]
Hover:    [Get Started]  (slightly raised, darker)
Active:   [Get Started]  (pressed down)
Disabled: [Get Started]  (grayed out, no interaction)
Loading:  [⟳ Loading ]   (spinner + text)
```

### Input States
```
Empty:    [____________]
Filled:   [Sourdough  ]
Focus:    [Sourdough__|]  (orange ring)
Error:    [_________  ]  (red ring + error text)
Disabled: [_________  ]  (grayed out)
```

### Card States
```
Default:  Normal elevation, no interaction
Hover:    Raised slightly, shadow increases
Active:   Pressed, shadow decreases
Selected: Orange border, subtle highlight
```

---

## Accessibility Notes

- Minimum touch target: 44x44px (mobile)
- Color contrast: WCAG AA (4.5:1 minimum)
- Focus indicators: Visible on all interactive elements
- Screen reader: Semantic HTML, ARIA labels
- Keyboard nav: Tab order logical, skip links available

---

**Next Steps:**
1. Review wireframes with stakeholders
2. Create high-fidelity mockups in Figma
3. Build interactive prototype
4. User testing with beta group

**Questions or need adjustments?** These wireframes are the blueprint - we can iterate!
