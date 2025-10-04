# Baker's Suite - Component Library

**Version:** 1.0  
**Last Updated:** October 4, 2025  
**Status:** Design Foundation  
**Framework:** React + Tailwind CSS + Shadcn/ui

---

## Table of Contents

1. [Component Architecture](#1-component-architecture)
2. [Core Components](#2-core-components)
3. [Feature Components](#3-feature-components)
4. [Layout Components](#4-layout-components)
5. [Form Components](#5-form-components)
6. [Feedback Components](#6-feedback-components)
7. [Data Display](#7-data-display)
8. [Navigation](#8-navigation)
9. [Utility Components](#9-utility-components)
10. [Component Patterns](#10-component-patterns)

---

## 1. Component Architecture

### Design Principles

**Atomic Design Approach:**
```
Atoms (Building Blocks)
  ↓
Molecules (Simple Components)
  ↓
Organisms (Complex Components)
  ↓
Templates (Page Layouts)
  ↓
Pages (Final Implementation)
```

### File Structure
```
src/components/
├── ui/                    # Shadcn/ui base components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── features/              # Feature-specific components
│   ├── ratio-calculator/
│   ├── schedule-optimizer/
│   ├── flavor-pairing/
│   └── ...
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── ...
└── shared/                # Shared/common components
    ├── WeatherWidget.tsx
    ├── RecipeCard.tsx
    └── ...
```

### Naming Conventions
- PascalCase for components: `Button.tsx`
- camelCase for utilities: `formatRecipe.ts`
- Prefix with "use" for hooks: `useWeather.ts`
- Suffix with "Context" for context: `RecipeContext.tsx`

---

## 2. Core Components

### 2.1 Button

**Variants:**
```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

**Sizes:**
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**States:**
```tsx
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
```

**Full Specification:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Usage
<Button 
  variant="primary" 
  size="lg" 
  icon={<Calculator />}
  iconPosition="left"
  onClick={handleCalculate}
>
  Calculate
</Button>
```

**Styles:**
```css
/* Primary */
bg-sunset-orange hover:bg-sunset-orange-600 
text-white font-semibold 
px-6 py-3 rounded-sm
transition-all duration-fast
hover:shadow-md hover:-translate-y-0.5

/* Secondary */
bg-warm-cream hover:bg-warm-gray-100
text-chocolate-brown font-semibold
border border-warm-gray-300

/* Outline */
bg-transparent border-2 border-sunset-orange
text-sunset-orange hover:bg-sunset-orange hover:text-white
```

---

### 2.2 Input

**Types:**
```tsx
<Input type="text" placeholder="Recipe name..." />
<Input type="number" placeholder="500" unit="g" />
<Input type="email" placeholder="email@example.com" />
```

**With Icons:**
```tsx
<Input 
  leftIcon={<Search />} 
  placeholder="Search recipes..."
/>

<Input 
  rightIcon={<Calendar />} 
  placeholder="Select date"
/>
```

**With Validation:**
```tsx
<Input 
  error="This field is required"
  helperText="Enter your recipe name"
/>
```

**Full Specification:**
```tsx
interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  unit?: string; // For measurement inputs
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

// Usage
<Input
  type="number"
  placeholder="500"
  unit="g"
  value={flourAmount}
  onChange={setFlourAmount}
  helperText="Enter flour weight"
/>
```

---

### 2.3 Card

**Basic Card:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Sourdough Boule</CardTitle>
    <CardDescription>Classic artisan bread</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>View Recipe</Button>
  </CardFooter>
</Card>
```

**Interactive Card:**
```tsx
<Card 
  hoverable 
  onClick={handleClick}
  className="cursor-pointer"
>
  {/* Content */}
</Card>
```

**Full Specification:**
```tsx
interface CardProps {
  hoverable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

// Styles
bg-white rounded-md shadow-sm p-6
transition-all duration-base
hover:shadow-md hover:-translate-y-1
```

---

## 3. Feature Components

### 3.1 Recipe Card

```tsx
interface RecipeCardProps {
  recipe: {
    id: string;
    name: string;
    image?: string;
    hydration: number;
    rating: number;
    tags: string[];
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

// Component
<RecipeCard
  recipe={recipe}
  onEdit={handleEdit}
  onClick={handleView}
/>

// Visual Structure:
┌──────────────────┐
│ [Recipe Image]   │
│                  │
├──────────────────┤
│ Sourdough Boule  │
│ 70% Hydration    │
│ ⭐⭐⭐⭐⭐        │
│                  │
│ #sourdough       │
│                  │
│ [Edit] [⋮]       │
└──────────────────┘
```

---

### 3.2 Weather Widget

```tsx
interface WeatherWidgetProps {
  location: string;
  temperature: number;
  humidity: number;
  pressure?: number;
  showRecommendations?: boolean;
  compact?: boolean;
}

// Usage
<WeatherWidget
  location="San Francisco, CA"
  temperature={72}
  humidity={55}
  showRecommendations={true}
/>

// Visual Structure:
┌────────────────────────────┐
│ ☀️ Today's Conditions      │
│                            │
│ 📍 San Francisco           │
│                            │
│ 72°F ━━━━━━━━ Ideal       │
│ 55% ━━━━━━━━━ Perfect      │
│                            │
│ 💡 Standard hydration OK   │
└────────────────────────────┘
```

---

### 3.3 Timeline Step

```tsx
interface TimelineStepProps {
  step: {
    id: string;
    title: string;
    description: string;
    time: Date;
    duration?: number;
    status: 'completed' | 'active' | 'upcoming';
  };
  onComplete?: () => void;
  onSnooze?: (minutes: number) => void;
}

// Usage
<TimelineStep
  step={currentStep}
  onComplete={handleComplete}
  onSnooze={handleSnooze}
/>

// Visual Structure:
┌────────────────────────────┐
│ ✅ 6:00 AM - Autolyse      │
│                            │
│ Mix flour + water          │
│ Rest 30 minutes            │
│                            │
│ [✓ Done] [Snooze]          │
└────────────────────────────┘
```

---

### 3.4 Ratio Calculator Input Grid

```tsx
interface IngredientRowProps {
  ingredient: {
    name: string;
    weight: number;
    unit: string;
    percentage: number;
  };
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
}

// Component renders as table row:
<tr>
  <td><Input value={name} /></td>
  <td><Input type="number" value={weight} /></td>
  <td><Select value={unit} /></td>
  <td><span>{percentage}%</span></td>
  <td><Button variant="ghost" icon={<Trash />} /></td>
</tr>
```

---

### 3.5 Flavor Pairing Card

```tsx
interface FlavorPairingCardProps {
  pairing: {
    ingredient1: string;
    ingredient2: string;
    confidence: number;
    compounds: string[];
    cuisines: string[];
  };
  onViewDetails: () => void;
  onSave: () => void;
}

// Visual Structure:
┌──────────────────┐
│ 🌰 Hazelnut      │
│                  │
│ Confidence: 95%  │
│ ⭐⭐⭐⭐⭐        │
│                  │
│ Shared:          │
│ • Vanillin       │
│ • Aldehydes      │
│                  │
│ [View Details]   │
└──────────────────┘
```

---

## 4. Layout Components

### 4.1 Header

```tsx
interface HeaderProps {
  user?: User;
  onSignOut?: () => void;
}

// Structure:
<header className="sticky top-0 bg-warm-cream border-b border-warm-gray-200">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <Logo />
      
      {/* Navigation */}
      <nav>
        <NavLinks />
      </nav>
      
      {/* User Menu */}
      <UserMenu user={user} />
    </div>
  </div>
</header>
```

---

### 4.2 Sidebar (Desktop)

```tsx
interface SidebarProps {
  activeRoute: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

// Structure:
<aside className="w-64 bg-white border-r border-warm-gray-200">
  <nav className="p-4">
    <SidebarLink 
      icon={<Home />} 
      label="Dashboard" 
      active={activeRoute === '/dashboard'}
    />
    <SidebarLink 
      icon={<Calculator />} 
      label="Calculator" 
    />
    {/* More links */}
  </nav>
</aside>
```

---

### 4.3 Mobile Navigation

```tsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
  <nav className="flex justify-around py-2">
    <NavItem icon={<Home />} label="Home" />
    <NavItem icon={<Book />} label="Recipes" />
    <NavItem icon={<Clock />} label="Timelines" />
    <NavItem icon={<User />} label="Profile" />
  </nav>
</div>
```

---

### 4.4 Dashboard Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <DashboardCard title="Active Bakes" />
  <DashboardCard title="Quick Tools" />
  <DashboardCard title="Starter" />
</div>
```

---

## 5. Form Components

### 5.1 Select/Dropdown

```tsx
<Select
  value={recipeType}
  onChange={setRecipeType}
  options={[
    { value: 'sourdough', label: 'Sourdough' },
    { value: 'quick-bread', label: 'Quick Bread' },
    { value: 'pastry', label: 'Pastry' }
  ]}
  placeholder="Select recipe type"
/>
```

---

### 5.2 Radio Group

```tsx
<RadioGroup value={scalingMethod} onChange={setScalingMethod}>
  <Radio value="flour" label="By Flour Weight" />
  <Radio value="yield" label="By Final Yield" />
  <Radio value="percentage" label="By Percentage" />
</RadioGroup>
```

---

### 5.3 Checkbox

```tsx
<Checkbox
  checked={autoAdjust}
  onChange={setAutoAdjust}
  label="Auto-adjust for weather"
/>
```

---

### 5.4 Date/Time Picker

```tsx
<DateTimePicker
  value={targetTime}
  onChange={setTargetTime}
  minDate={new Date()}
  label="When do you want bread ready?"
/>
```

---

### 5.5 File Upload (Image)

```tsx
<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  maxSize={5} // MB
  aspectRatio={4/3}
  label="Upload bread photo"
/>
```

---

## 6. Feedback Components

### 6.1 Alert/Toast

```tsx
// Success
<Toast variant="success">
  Recipe saved successfully!
</Toast>

// Error
<Toast variant="error">
  Failed to save recipe
</Toast>

// Info
<Toast variant="info">
  Weather updated: 72°F
</Toast>

// Warning
<Toast variant="warning">
  Temperature dropped - adjust timeline?
</Toast>
```

---

### 6.2 Modal/Dialog

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Delete Recipe?"
  description="This action cannot be undone."
>
  <div className="flex gap-4">
    <Button variant="outline" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  </div>
</Modal>
```

---

### 6.3 Loading States

```tsx
// Spinner
<Spinner size="lg" />

// Skeleton
<Skeleton className="h-32 w-full" />

// Progress Bar
<ProgressBar value={70} max={100} />

// Loading Button
<Button loading>
  <Spinner size="sm" />
  Saving...
</Button>
```

---

### 6.4 Empty State

```tsx
<EmptyState
  icon={<BookOpen />}
  title="No recipes yet"
  description="Create your first recipe to get started"
  action={
    <Button onClick={handleCreate}>
      Create Recipe
    </Button>
  }
/>
```

---

## 7. Data Display

### 7.1 Table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Ingredient</TableHead>
      <TableHead>Weight</TableHead>
      <TableHead>Percentage</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {ingredients.map(ing => (
      <TableRow key={ing.id}>
        <TableCell>{ing.name}</TableCell>
        <TableCell>{ing.weight}g</TableCell>
        <TableCell>{ing.percentage}%</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### 7.2 Badge

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">New</Badge>
```

---

### 7.3 Rating

```tsx
<Rating
  value={4.5}
  max={5}
  onChange={setRating}
  readOnly={false}
/>

// Displays: ⭐⭐⭐⭐☆
```

---

### 7.4 Progress Indicator

```tsx
<Progress value={hydration} max={100} label="Hydration" />

// Visual:
70% ━━━━━━━━━━░░░░ 100%
```

---

### 7.5 Timeline Visualization

```tsx
<TimelineChart
  steps={timelineSteps}
  startTime={startTime}
  endTime={endTime}
  currentTime={currentTime}
/>

// Renders Gantt-style chart
```

---

## 8. Navigation

### 8.1 Breadcrumbs

```tsx
<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/recipes">Recipes</BreadcrumbItem>
  <BreadcrumbItem active>Sourdough Boule</BreadcrumbItem>
</Breadcrumbs>

// Renders: Home > Recipes > Sourdough Boule
```

---

### 8.2 Tabs

```tsx
<Tabs value={activeTab} onChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
    <TabsTrigger value="instructions">Instructions</TabsTrigger>
    <TabsTrigger value="notes">Notes</TabsTrigger>
  </TabsList>
  <TabsContent value="ingredients">
    {/* Ingredients content */}
  </TabsContent>
  {/* More content */}
</Tabs>
```

---

### 8.3 Pagination

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

---

## 9. Utility Components

### 9.1 Tooltip

```tsx
<Tooltip content="Your starter needs feeding">
  <Button icon={<Info />} />
</Tooltip>
```

---

### 9.2 Dropdown Menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="ghost" icon={<MoreVertical />} />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>
      <Edit /> Edit
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleDuplicate}>
      <Copy /> Duplicate
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleDelete} className="text-error">
      <Trash /> Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### 9.3 Popover

```tsx
<Popover>
  <PopoverTrigger>
    <Button>Settings</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="space-y-4">
      {/* Settings content */}
    </div>
  </PopoverContent>
</Popover>
```

---

### 9.4 Avatar

```tsx
<Avatar
  src={user.avatar}
  alt={user.name}
  fallback={user.initials}
  size="lg"
/>
```

---

## 10. Component Patterns

### 10.1 Compound Components

```tsx
// Card as compound component
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

---

### 10.2 Render Props

```tsx
<DataFetcher url="/api/recipes">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />
    if (error) return <Error message={error} />
    return <RecipeList recipes={data} />
  }}
</DataFetcher>
```

---

### 10.3 Higher-Order Components

```tsx
const withWeather = (Component) => {
  return (props) => {
    const weather = useWeather();
    return <Component {...props} weather={weather} />;
  };
};

export default withWeather(TimelineCreator);
```

---

### 10.4 Custom Hooks

```tsx
// useRecipe hook
const useRecipe = (recipeId: string) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch logic
  
  return { recipe, loading, updateRecipe, deleteRecipe };
};

// Usage
const { recipe, loading } = useRecipe('recipe-123');
```

---

## Component Checklist

**Before creating a new component:**
- [ ] Check if Shadcn/ui has a base component
- [ ] Check if similar component exists
- [ ] Define clear props interface
- [ ] Add TypeScript types
- [ ] Include accessibility (ARIA labels, keyboard nav)
- [ ] Handle loading/error states
- [ ] Add mobile responsiveness
- [ ] Write usage documentation
- [ ] Create Storybook story (if applicable)

---

## Responsive Patterns

```tsx
// Mobile-first approach
<div className="
  flex flex-col          // Mobile: stack
  md:flex-row           // Tablet+: horizontal
  gap-4                  // Always 4-unit gap
  p-4 md:p-6 lg:p-8     // Responsive padding
">
  <div className="w-full md:w-1/2">Column 1</div>
  <div className="w-full md:w-1/2">Column 2</div>
</div>
```

---

## Accessibility Standards

**All components must:**
- Use semantic HTML
- Include ARIA labels where needed
- Support keyboard navigation
- Maintain focus states
- Provide screen reader text
- Meet WCAG AA contrast ratios

```tsx
// Good example
<button
  aria-label="Delete recipe"
  onClick={handleDelete}
  className="focus-visible:ring-4 focus-visible:ring-sunset-orange/50"
>
  <Trash aria-hidden="true" />
  <span className="sr-only">Delete</span>
</button>
```

---

**Next Steps:**
1. Implement core components using Shadcn/ui
2. Build feature-specific components
3. Create Storybook for component library
4. Write unit tests for components
5. Document usage examples

**Questions or need additional components?** This library will grow with the product!
