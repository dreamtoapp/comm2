# Color Usage Report

## Hardcoded Colors

### Global Error Page (`/app/global-error.tsx`)
- Background color: `#f3f4f6` (Light gray)
- Error title color: `#dc2626` (Red)
- Primary text color: `#4b5563` (Dark gray)
- Secondary text color: `#6b7280` (Medium gray)
- Link color: `#1d4ed8` (Blue)
- Border color: `#e5e7eb` (Light gray)

### Global Styles (`/app/globals.css`)
- Various rgba() values for overlays and backgrounds
- White text color: `color: white`
- Gradient backgrounds with rgba() values

### Manifest Configuration (`/app/manifest.ts`)
- Background color: `#ffffff` (White)
- Theme color: `#2196f3` (Blue)

### Not Found Page (`/app/not-found.tsx`)
- Red color for icon: `text-red-500`
- Drop shadow color: `rgba(255,107,107,0.3)` (Light red)

## Color System (Tailwind)

The project uses a comprehensive color system defined in `tailwind.config.ts`:

### Base Colors
- `background`: `hsl(var(--background))`
- `foreground`: `hsl(var(--foreground))`
- `card`: `hsl(var(--card))`
- `card-foreground`: `hsl(var(--card-foreground))`
- `popover`: `hsl(var(--popover))`
- `popover-foreground`: `hsl(var(--popover-foreground))`

### Theme Colors
- Primary colors with foreground variants
- Secondary colors with foreground variants
- Muted colors with foreground variants
- Accent colors with foreground variants
- Destructive colors with foreground variants

### Chart Colors
- `chart-1` to `chart-5`: Custom chart colors using HSL

### Info Colors
- `info-soft-bg`: Soft background for info elements
- `info-fg`: Foreground color for info elements

## Recommendations

1. **Consistency**: The project has a good foundation with Tailwind's color system, but there are still some hardcoded colors that should be moved to the theme system.

2. **Migration Plan**:
   - Move hardcoded colors from global-error.tsx to Tailwind theme
   - Replace rgba() values in globals.css with Tailwind utilities
   - Standardize all color usage through Tailwind classes

3. **Best Practices**:
   - Use Tailwind theme colors consistently
   - Avoid inline styles with hardcoded colors
   - Use CSS variables for theming
   - Maintain a single source of truth for colors in tailwind.config.ts
