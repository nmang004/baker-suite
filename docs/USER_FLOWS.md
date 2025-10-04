# Baker's Suite - User Flows

**Version:** 1.0  
**Last Updated:** October 4, 2025  
**Status:** Design Foundation

---

## Table of Contents

1. [Onboarding Flow](#1-onboarding-flow)
2. [First Recipe Creation](#2-first-recipe-creation)
3. [Planning First Bake](#3-planning-first-bake)
4. [Active Bake Timeline](#4-active-bake-timeline)
5. [Logging Completed Bake](#5-logging-completed-bake)
6. [Flavor Discovery Flow](#6-flavor-discovery-flow)
7. [Starter Management](#7-starter-management)
8. [Premium Upgrade Flow](#8-premium-upgrade-flow)
9. [Recipe Import Flow](#9-recipe-import-flow)
10. [Mobile-Specific Flows](#10-mobile-specific-flows)

---

## Flow Conventions

```
┌─────────┐
│ Screen  │  = Page/Screen
└─────────┘

[Action]     = User action/decision

───>         = Flow direction

╔═════╦═════╗
║ YES ║ NO  ║  = Decision point
╚═════╩═════╝
```

---

## 1. Onboarding Flow

### 1.1 New User Journey (First 5 Minutes)

```
START: User visits bakersuite.com

┌──────────────────┐
│  Landing Page    │
│                  │
│  "The Intelligent│
│   Baking         │
│   Companion"     │
│                  │
│  [Get Started]   │
└──────────────────┘
        │
        │ [Click Get Started]
        ↓
┌──────────────────┐
│  Sign Up         │
│                  │
│  • Email/Pass    │
│  • Google        │
│  • Apple         │
└──────────────────┘
        │
        │ [Complete signup]
        ↓
┌──────────────────┐
│  Welcome Tour    │
│  (Step 1 of 3)   │
│                  │
│  "Plan perfect   │
│   timelines with │
│   weather        │
│   awareness"     │
│                  │
│  [Next →]        │
└──────────────────┘
        │
        ↓
┌──────────────────┐
│  Welcome Tour    │
│  (Step 2 of 3)   │
│                  │
│  "Scale recipes  │
│   with baker's   │
│   percentages"   │
│                  │
│  [Next →]        │
└──────────────────┘
        │
        ↓
┌──────────────────┐
│  Welcome Tour    │
│  (Step 3 of 3)   │
│                  │
│  "Discover       │
│   unexpected     │
│   flavors"       │
│                  │
│  [Get Started]   │
└──────────────────┘
        │
        ↓
┌──────────────────┐
│  Profile Setup   │
│                  │
│  Name: [____]    │
│  Location: [__]  │
│  Units: [Metric] │
│                  │
│  [Continue]      │
└──────────────────┘
        │
        ↓
┌──────────────────┐
│  Starter         │
│  Preference      │
│                  │
│  Do you have a   │
│  sourdough       │
│  starter?        │
│                  │
│  [Yes] [No]      │
└──────────────────┘
        │
        ├─── [Yes] ──→ ┌────────────────┐
        │              │ Create Starter │
        │              │ Profile        │
        │              │                │
        │              │ Name: [____]   │
        │              │ Age: [____]    │
        │              │                │
        │              │ [Continue]     │
        │              └────────────────┘
        │                      │
        └─── [No] ─────────────┘
                               ↓
                    ┌──────────────────┐
                    │  First Action    │
                    │  Prompt          │
                    │                  │
                    │  What would you  │
                    │  like to do?     │
                    │                  │
                    │  • Create Recipe │
                    │  • Explore Tools │
                    │  • Plan Timeline │
                    │                  │
                    │  [Choose]        │
                    └──────────────────┘
                               ↓
                    ┌──────────────────┐
                    │  Dashboard       │
                    │  (Empty State)   │
                    │                  │
                    │  Quick access to │
                    │  all features    │
                    └──────────────────┘

END: User in main app, ready to bake
```

### 1.2 First-Time User Goals

**Within 5 minutes, user should:**
- ✅ Understand what the app does
- ✅ Complete basic profile
- ✅ See personalized dashboard
- ✅ Know how to create first recipe or timeline

**Success Metrics:**
- 80% complete onboarding
- Average time: 3-4 minutes
- 60% create recipe or timeline within 10 minutes

---

## 2. First Recipe Creation

### 2.1 From Dashboard to Saved Recipe

```
START: User on Dashboard

┌──────────────────┐
│  Dashboard       │
│                  │
│  [+ New Recipe]  │
│  or              │
│  [Quick Tools:   │
│   Calculator]    │
└──────────────────┘
        │
        │ [Click New Recipe or Calculator]
        ↓
┌──────────────────┐
│  Choose Method   │
│                  │
│  How do you want │
│  to create?      │
│                  │
│  • Manual Entry  │
│  • Import URL    │
│  • Use Template  │
└──────────────────┘
        │
        ├─── [Manual Entry] ───┐
        │                      ↓
        │           ┌──────────────────┐
        │           │  Recipe Builder  │
        │           │                  │
        │           │  Name: [____]    │
        │           │  Type: [____▾]   │
        │           │                  │
        │           │  Ingredients:    │
        │           │  [+ Add]         │
        │           └──────────────────┘
        │                      │
        │                      │ [Add ingredients]
        │                      ↓
        │           ┌──────────────────┐
        │           │  Ingredient List │
        │           │                  │
        │           │  Flour    500g   │
        │           │  Water    350g   │
        │           │  Salt      10g   │
        │           │                  │
        │           │  Total: 860g     │
        │           │  Hydro: 70%      │
        │           │                  │
        │           │  [Continue]      │
        │           └──────────────────┘
        │                      │
        ├─── [Import URL] ─────┤
        │                      ↓
        │           ┌──────────────────┐
        │           │  Import Recipe   │
        │           │                  │
        │           │  URL: [paste]    │
        │           │                  │
        │           │  [Import]        │
        │           └──────────────────┘
        │                      │
        │                      │ [Processing...]
        │                      ↓
        │           ┌──────────────────┐
        │           │  Review Import   │
        │           │                  │
        │           │  Detected:       │
        │           │  • 6 ingredients │
        │           │  • 8 steps       │
        │           │                  │
        │           │  [Looks good]    │
        │           │  [Edit]          │
        │           └──────────────────┘
        │                      │
        └─── [Use Template] ───┤
                               │ [All paths merge]
                               ↓
                    ┌──────────────────┐
                    │  Add Instructions│
                    │  (Optional)      │
                    │                  │
                    │  Step 1: [___]   │
                    │  Step 2: [___]   │
                    │                  │
                    │  [Skip] [Add]    │
                    └──────────────────┘
                               │
                               ↓
                    ┌──────────────────┐
                    │  Save Recipe     │
                    │                  │
                    │  ✅ Saved!       │
                    │                  │
                    │  What's next?    │
                    │  • Plan timeline │
                    │  • Scale recipe  │
                    │  • Back to home  │
                    └──────────────────┘

END: Recipe saved, ready for use
```

### 2.2 Decision Points

**If user struggles with percentages:**
→ Show tooltip: "Don't worry! Just enter weights, we'll calculate percentages"

**If import fails:**
→ Offer manual entry: "Can't import? No problem, enter it manually"

**If user exits early:**
→ Auto-save draft: "Your recipe is saved as draft"

---

## 3. Planning First Bake

### 3.1 Recipe to Active Timeline

```
START: User has saved recipe

┌──────────────────┐
│  Recipe Detail   │
│                  │
│  Sourdough Boule │
│                  │
│  [Create         │
│   Timeline]      │
└──────────────────┘
        │
        │ [Click Create Timeline]
        ↓
┌──────────────────┐
│  Timeline Setup  │
│                  │
│  When ready?     │
│  Date: [____]    │
│  Time: [____]    │
│                  │
│  Recipe: [____▾] │
└──────────────────┘
        │
        │ [Select date/time]
        ↓
┌──────────────────┐
│  Weather Check   │
│                  │
│  Fetching        │
│  conditions...   │
│                  │
│  ☀️ 72°F         │
│  55% humidity    │
│                  │
│  [Looks good!]   │
└──────────────────┘
        │
        ↓
┌──────────────────┐
│  Generate        │
│  Timeline        │
│                  │
│  Calculating...  │
│  ▓▓▓▓▓▓▓░░░ 70%  │
└──────────────────┘
        │
        ↓
┌──────────────────┐
│  Review Timeline │
│                  │
│  18 steps        │
│  Start: 12am     │
│  Finish: 6pm     │
│                  │
│  Weather adj:    │
│  +15 min         │
│                  │
│  [Start Baking]  │
│  [Adjust]        │
└──────────────────┘
        │
        ├─── [Adjust] ──→ ┌────────────────┐
        │                 │ Adjust Times   │
        │                 │                │
        │                 │ Bulk ferm:     │
        │                 │ [6 hrs] → [7]  │
        │                 │                │
        │                 │ [Recalculate]  │
        │                 └────────────────┘
        │                         │
        └─── [Start Baking] ──────┘
                                   ↓
                        ┌──────────────────┐
                        │  Active Timeline │
                        │                  │
                        │  ✅ Feed starter │
                        │  ⏳ Autolyse (2h)│
                        │  ⏳ Mix dough    │
                        │  ...             │
                        │                  │
                        │  🔔 Reminders ON │
                        └──────────────────┘

END: Timeline active, notifications scheduled
```

---

## 4. Active Bake Timeline

### 4.1 During Baking Session

```
START: Timeline is active

┌──────────────────┐
│  Timeline View   │
│                  │
│  ✅ Step 1 Done  │
│  ⏰ Step 2 (now) │
│  ⏳ Step 3 (1h)  │
│  ...             │
└──────────────────┘
        │
        │ [Notification fires]
        ↓
┌──────────────────┐
│  🔔 Push         │
│  Notification    │
│                  │
│  "Time to fold   │
│   your dough!"   │
│                  │
│  [Open App]      │
└──────────────────┘
        │
        │ [User opens app]
        ↓
┌──────────────────┐
│  Current Step    │
│                  │
│  📍 Fold #2      │
│                  │
│  Instructions:   │
│  Coil fold the   │
│  dough gently    │
│                  │
│  [✓ Mark Done]   │
│  [Snooze 15min]  │
└──────────────────┘
        │
        ├─── [Mark Done] ────┐
        │                    ↓
        │         ┌──────────────────┐
        │         │  Progress Update │
        │         │                  │
        │         │  ✅ Step complete│
        │         │                  │
        │         │  Next:           │
        │         │  Fold #3 in 1hr  │
        │         └──────────────────┘
        │                    │
        │                    ↓
        │         ┌──────────────────┐
        │         │  Return to       │
        │         │  Timeline        │
        │         │                  │
        │         │  ✅ Fold #1      │
        │         │  ✅ Fold #2      │
        │         │  ⏳ Fold #3 (1h) │
        │         └──────────────────┘
        │                    │
        └─── [Snooze] ───────┤
                            │
                            │ [Cycle continues until...]
                            ↓
                 ┌──────────────────┐
                 │  Final Step      │
                 │                  │
                 │  🎉 Bake & Cool  │
                 │                  │
                 │  [✓ Finished!]   │
                 └──────────────────┘
                            ↓
                 ┌──────────────────┐
                 │  Log This Bake?  │
                 │                  │
                 │  Rate & add      │
                 │  notes to your   │
                 │  journal         │
                 │                  │
                 │  [Yes] [Later]   │
                 └──────────────────┘

END: Bake complete, ready to log
```

### 4.2 Edge Cases

**Weather changes mid-bake:**
```
┌──────────────────┐
│  ⚠️ Weather Alert│
│                  │
│  Temp dropped    │
│  to 68°F         │
│                  │
│  Extend proof    │
│  by 20 min?      │
│                  │
│  [Yes] [No]      │
└──────────────────┘
```

**User needs to pause:**
```
┌──────────────────┐
│  Pause Timeline  │
│                  │
│  Why pausing?    │
│  • Refrigerate   │
│  • Life happened │
│  • Other         │
│                  │
│  [Confirm Pause] │
└──────────────────┘
```

---

## 5. Logging Completed Bake

### 5.1 From Timeline to Journal

```
START: User finished bake

┌──────────────────┐
│  Timeline        │
│  Complete! 🎉    │
│                  │
│  [Log This Bake] │
│  [Dismiss]       │
└──────────────────┘
        │
        │ [Click Log This Bake]
        ↓
┌──────────────────┐
│  Bake Journal    │
│  Entry           │
│                  │
│  Recipe: [auto]  │
│                  │
│  [📸 Add Photo]  │
└──────────────────┘
        │
        │ [Take/Upload photo]
        ↓
┌──────────────────┐
│  Photo Added     │
│                  │
│  [Preview]       │
│                  │
│  How was it?     │
│  ⭐⭐⭐⭐⭐      │
│                  │
│  [Continue]      │
└──────────────────┘
        │
        ↓
┌──────────────────┐
│  Add Notes       │
│                  │
│  Quick tags:     │
│  [Perfect!]      │
│  [Good crumb]    │
│  [Great taste]   │
│                  │
│  Notes: [____]   │
│                  │
│  [Continue]      │
└──────────────────┘
        │
        ↓
┌──────────────────┐
│  Any Issues?     │
│                  │
│  □ Dense crumb   │
│  □ Over-proofed  │
│  □ Burnt         │
│  ☑ None!         │
│                  │
│  [Save Entry]    │
└──────────────────┘
        │
        ↓
┌──────────────────┐
│  ✅ Saved!       │
│                  │
│  Bake #15 logged │
│                  │
│  💡 Tip:         │
│  Your avg rating │
│  is 4.3 stars!   │
│                  │
│  [View Journal]  │
│  [Done]          │
└──────────────────┘

END: Bake logged, stats updated
```

### 5.2 Smart Suggestions

**If rating is low (1-2 stars):**
```
┌──────────────────┐
│  We're Sorry!    │
│                  │
│  What went wrong?│
│  (helps us help  │
│   you improve)   │
│                  │
│  [Select issue]  │
└──────────────────┘
```

**If this is 5th bake:**
```
┌──────────────────┐
│  🎉 Milestone!   │
│                  │
│  5 bakes logged! │
│  Badge earned    │
│                  │
│  [Share] [Close] │
└──────────────────┘
```

---

## 6. Flavor Discovery Flow

### 6.1 Finding New Pairings

```
START: User curious about flavors

┌──────────────────┐
│  Dashboard       │
│                  │
│  [Flavor Pairing]│
│  Quick Tool      │
└──────────────────┘
        │
        │ [Click Flavor Pairing]
        ↓
┌──────────────────┐
│  Flavor Explorer │
│                  │
│  What flavors    │
│  are you working │
│  with?           │
│                  │
│  [Search...]     │
└──────────────────┘
        │
        │ [Type "chocolate"]
        ↓
┌──────────────────┐
│  Search Results  │
│                  │
│  🍫 Chocolate    │
│  🍫 Dark Choc    │
│  🍫 Milk Choc    │
│                  │
│  [Select]        │
└──────────────────┘
        │
        │ [Select chocolate]
        ↓
┌──────────────────┐
│  Add More?       │
│                  │
│  Base: Chocolate │
│                  │
│  Add another     │
│  ingredient?     │
│                  │
│  [+ Add] [Find]  │
└──────────────────┘
        │
        ├─── [Add] ──→ [Repeat search]
        │
        └─── [Find] ─────────┐
                             ↓
                  ┌──────────────────┐
                  │  Analyzing...    │
                  │                  │
                  │  Finding best    │
                  │  pairings for    │
                  │  chocolate       │
                  └──────────────────┘
                             ↓
                  ┌──────────────────┐
                  │  Top Pairings    │
                  │                  │
                  │  🌰 Hazelnut 95% │
                  │  🍊 Orange   92% │
                  │  ☕ Coffee   88% │
                  │  🫐 Raspberry 85%│
                  │                  │
                  │  [View Details]  │
                  └──────────────────┘
                             │
                             │ [Click Orange]
                             ↓
                  ┌──────────────────┐
                  │  Pairing Detail  │
                  │                  │
                  │  Chocolate +     │
                  │  Orange          │
                  │                  │
                  │  Why: Shared     │
                  │  compounds...    │
                  │                  │
                  │  Recipes:        │
                  │  • Choc Orange   │
                  │    Babka         │
                  │  • Dark Choc     │
                  │    Scones        │
                  │                  │
                  │  [💾 Save]       │
                  │  [Try Recipe]    │
                  └──────────────────┘

END: User discovers new pairing, saves for later
```

---

## 7. Starter Management

### 7.1 Feeding Routine

```
START: Notification time to feed

┌──────────────────┐
│  🔔 Notification │
│                  │
│  "Feed your      │
│   starter now"   │
│                  │
│  [Open App]      │
│  [Snooze 30min]  │
└──────────────────┘
        │
        │ [Open app]
        ↓
┌──────────────────┐
│  Starter Tracker │
│                  │
│  Levain          │
│  Last fed: 12h   │
│  Health: Good    │
│                  │
│  [Feed Now]      │
│  [Postpone]      │
└──────────────────┘
        │
        │ [Feed Now]
        ↓
┌──────────────────┐
│  Log Feeding     │
│                  │
│  Ratio: 1:1:1    │
│                  │
│  Starter: 50g    │
│  Flour:   50g    │
│  Water:   50g    │
│                  │
│  Notes: [___]    │
│                  │
│  [📸 Photo]      │
│  [Save]          │
└──────────────────┘
        │
        │ [Optional: Add photo & notes]
        ↓
┌──────────────────┐
│  ✅ Fed!         │
│                  │
│  Next feed:      │
│  Tomorrow 8am    │
│                  │
│  🔔 Reminder set │
│                  │
│  [Done]          │
└──────────────────┘

END: Starter fed, next reminder scheduled
```

### 7.2 Discard Helper

```
User has ~150g discard

┌──────────────────┐
│  Starter Tracker │
│                  │
│  💡 You have     │
│  150g discard    │
│                  │
│  [Find Recipes]  │
└──────────────────┘
        │
        │ [Find Recipes]
        ↓
┌──────────────────┐
│  Discard Recipes │
│                  │
│  Crackers (150g) │
│  Pancakes (100g) │
│  Waffles (120g)  │
│                  │
│  [View Recipe]   │
└──────────────────┘
        │
        │ [Select Crackers]
        ↓
┌──────────────────┐
│  Recipe Detail   │
│                  │
│  Discard Crackers│
│                  │
│  Uses: 150g      │
│  Time: 30 min    │
│                  │
│  [Start Baking]  │
│  [Save for Later]│
└──────────────────┘

END: User utilizes discard
```

---

## 8. Premium Upgrade Flow

### 8.1 Free to Premium

```
START: User hits free tier limit

┌──────────────────┐
│  Recipe Limit    │
│                  │
│  You've reached  │
│  10 recipes      │
│  (Free tier)     │
│                  │
│  [Upgrade]       │
│  [Delete old]    │
└──────────────────┘
        │
        ├─── [Delete old] → [Manage recipes]
        │
        └─── [Upgrade] ──────┐
                             ↓
                  ┌──────────────────┐
                  │  Premium Plans   │
                  │                  │
                  │  💎 Premium      │
                  │  $7/month        │
                  │                  │
                  │  ✅ Unlimited    │
                  │  ✅ Photos       │
                  │  ✅ Advanced     │
                  │                  │
                  │  [Try 14 Days    │
                  │   Free]          │
                  └──────────────────┘
                             │
                             │ [Start trial]
                             ↓
                  ┌──────────────────┐
                  │  Payment Setup   │
                  │                  │
                  │  💳 Card info    │
                  │  [____]          │
                  │                  │
                  │  ℹ️ No charge    │
                  │  for 14 days     │
                  │                  │
                  │  [Start Trial]   │
                  └──────────────────┘
                             │
                             ↓
                  ┌──────────────────┐
                  │  🎉 Welcome to   │
                  │  Premium!        │
                  │                  │
                  │  Trial ends:     │
                  │  Dec 28          │
                  │                  │
                  │  [Start Using]   │
                  └──────────────────┘
                             ↓
                  ┌──────────────────┐
                  │  Dashboard       │
                  │  (Premium)       │
                  │                  │
                  │  💎 Premium      │
                  │  Active          │
                  │                  │
                  │  All features    │
                  │  unlocked!       │
                  └──────────────────┘

END: User has premium access
```

---

## 9. Recipe Import Flow

### 9.1 URL Import with Parsing

```
START: User has recipe URL

┌──────────────────┐
│  Recipe Library  │
│                  │
│  [+ New Recipe]  │
└──────────────────┘
        │
        │ [Click New]
        ↓
┌──────────────────┐
│  Import Method   │
│                  │
│  • Manual        │
│  • URL ←         │
│  • Template      │
└──────────────────┘
        │
        │ [Select URL]
        ↓
┌──────────────────┐
│  Paste URL       │
│                  │
│  URL:            │
│  [kingarthur...] │
│                  │
│  [Import]        │
└──────────────────┘
        │
        │ [Click Import]
        ↓
┌──────────────────┐
│  Importing...    │
│                  │
│  📡 Fetching     │
│  🔍 Analyzing    │
│  ✨ Parsing      │
│                  │
│  ▓▓▓▓▓▓░░░ 70%   │
└──────────────────┘
        │
        ↓
        ╔══════════════════╗
        ║  Success?        ║
        ╠═══════╦══════════╣
        ║  YES  ║   NO     ║
        ╚═══════╩══════════╝
           │         │
           │         └──→ ┌────────────────┐
           │              │ Import Failed  │
           │              │                │
           │              │ Can't parse    │
           │              │ this site      │
           │              │                │
           │              │ [Try Manual]   │
           │              │ [Different URL]│
           │              └────────────────┘
           ↓
┌──────────────────┐
│  Review Import   │
│                  │
│  ✅ Title        │
│  ✅ 8 ingredients│
│  ✅ 6 steps      │
│  ⚠️ Check flour  │
│     amount       │
│                  │
│  [Edit] [Accept] │
└──────────────────┘
        │
        ├─── [Edit] ──→ [Manual adjustments]
        │
        └─── [Accept] ───────┐
                             ↓
                  ┌──────────────────┐
                  │  Calculate       │
                  │  Percentages     │
                  │                  │
                  │  Computing       │
                  │  ratios...       │
                  └──────────────────┘
                             ↓
                  ┌──────────────────┐
                  │  ✅ Imported!    │
                  │                  │
                  │  Recipe saved    │
                  │                  │
                  │  [View Recipe]   │
                  │  [Import Another]│
                  └──────────────────┘

END: Recipe imported and saved
```

---

## 10. Mobile-Specific Flows

### 10.1 Mobile Notification → Action

```
START: Push notification on phone

📱 [Notification Banner]
   "Fold your dough in 5 min"
   [Tap to open]
        │
        │ [Tap]
        ↓
┌─────────────────┐
│  App Opens      │
│  (Direct to     │
│   timeline)     │
│                 │
│  Current step   │
│  highlighted    │
└─────────────────┘
        │
        │ [Quick action]
        ↓
┌─────────────────┐
│  ✓ Mark Done    │
│                 │
│  Swipe to       │
│  complete       │
│                 │
│  →→→→ [✓]       │
└─────────────────┘

END: Task complete, back to timeline
```

### 10.2 Camera → Journal Entry

```
START: User in kitchen with fresh bread

📱 [Open app]
        │
        ↓
┌─────────────────┐
│  Dashboard      │
│                 │
│  [📸 Quick Log] │
└─────────────────┘
        │
        │ [Tap Quick Log]
        ↓
┌─────────────────┐
│  Camera Opens   │
│  Immediately    │
│                 │
│  [📸 Capture]   │
└─────────────────┘
        │
        │ [Take photo]
        ↓
┌─────────────────┐
│  Photo Preview  │
│                 │
│  [Retake]       │
│  [Use Photo]    │
└─────────────────┘
        │
        │ [Use Photo]
        ↓
┌─────────────────┐
│  Quick Rate     │
│                 │
│  ⭐⭐⭐⭐⭐     │
│                 │
│  [Add Note]     │
│  [Save]         │
└─────────────────┘

END: Bake logged with photo
```

---

## Flow Success Metrics

### Onboarding
- **Goal:** 80% completion
- **Time:** <5 minutes average
- **Drop-off:** <20% at any step

### First Recipe
- **Goal:** 60% create recipe in first session
- **Time:** <10 minutes average
- **Method:** 50% manual, 30% import, 20% template

### Timeline Creation
- **Goal:** 70% create timeline after recipe
- **Time:** <3 minutes average
- **Start Rate:** 80% start timeline after creation

### Bake Logging
- **Goal:** 50% log completed bakes
- **Time:** <2 minutes average
- **Photo Rate:** 30% include photos

### Premium Conversion
- **Trigger:** Recipe limit most common (60%)
- **Conversion:** 10% free → premium
- **Trial Start:** 25% start trial when prompted

---

## Edge Cases & Error Handling

### Import Failures
```
If import fails 2x:
→ Offer manual entry
→ Show import tips
→ Contact support option
```

### Offline Usage
```
If offline:
→ Show cached recipes
→ Disable timeline creation
→ Queue logs for sync
→ Show offline indicator
```

### Weather API Down
```
If weather unavailable:
→ Use last known conditions
→ Manual temp input option
→ Disable auto-adjustments
→ Warning indicator
```

---

**Next Steps:**
1. Validate flows with user testing
2. Identify friction points
3. A/B test alternative paths
4. Measure actual vs. expected metrics

**Questions or need additional flows?** These are living documents - we'll refine based on real user behavior!
