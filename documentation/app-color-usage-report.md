# App Directory Color Usage Report

## Hardcoded Colors in App Directory

### Global Error Page (`/app/global-error.tsx`)
- Background color: `#f3f4f6` (Light gray)
- Error title color: `#dc2626` (Red)
- Primary text color: `#4b5563` (Dark gray)
- Secondary text color: `#6b7280` (Medium gray)
- Link color: `#1d4ed8` (Blue)
- Border color: `#e5e7eb` (Light gray)

### Global Layout (`/app/layout.tsx`)
- Commented theme color: `#2196f3` (Blue)

### Manifest Configuration (`/app/manifest.ts`)
- Background color: `#ffffff` (White)
- Theme color: `#2196f3` (Blue)

### Not Found Page (`/app/not-found.tsx`)
- Red color for icon: `text-red-500`
- Drop shadow color: `rgba(255,107,107,0.3)` (Light red)

### Pusher Notifications (`/app/dashboard/orders-mangment/component/pusherNotifaction/PusherNotify.tsx`)
- Gradient colors:
  - Blue: `from-blue-500 to-blue-700`
  - Green: `from-green-500 to-green-700`
  - Yellow: `from-yellow-500 to-yellow-700`
  - Gray: `from-gray-500 to-gray-700`

### Sales Reports

#### Sales Charts (`/app/dashboard/reports/sales/component/`)
- Bar Chart:
  - Default color: `hsl(var(--primary))`
- Line Chart:
  - Default color: `hsl(var(--chart-2))`
- Pie Chart:
  - Colors using CSS variables:
    - `hsl(var(--chart-1))`
    - `hsl(var(--chart-2))`
    - `hsl(var(--chart-3))`
    - `hsl(var(--chart-4))`
    - `hsl(var(--chart-5))`
    - `hsl(var(--primary))`
    - `hsl(var(--accent))`
- Print Styles:
  - Background: `#fff`
  - Text: `#111`, `#222`
  - Border: `#bbb`

### Sales Report Client (`/app/dashboard/reports/sales/component/SalesReportClient.tsx`)
- Default Recharts colors:
  - Bar Chart: `#8884d8`
  - Line Chart: `#82ca9d`
  - Pie Chart: `['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']`

## Recommendations

1. **Consistency**: While most components use Tailwind's theme system, there are still some hardcoded colors that should be moved to the theme system.

2. **Migration Plan**:
   - Move hardcoded colors from global-error.tsx to Tailwind theme
   - Replace rgba() values in print styles with Tailwind utilities
   - Standardize chart colors using Tailwind theme colors
   - Remove hardcoded Recharts colors in favor of theme variables

3. **Best Practices**:
   - Use Tailwind theme colors consistently
   - Avoid inline styles with hardcoded colors
   - Use CSS variables for theming
   - Maintain a single source of truth for colors in tailwind.config.ts
