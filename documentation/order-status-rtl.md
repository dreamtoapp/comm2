# Order Status RTL Support

**Created:** 2025-05-16

This document outlines the Right-to-Left (RTL) support implemented for order status displays in the e-commerce platform, following the patterns established in the CartPreview component.

## RTL Implementation Guidelines

All components displaying order status with Arabic text should follow these RTL support patterns:

1. **Container Direction Attribute**
   ```jsx
   <div dir="rtl">
     {/* Order status content in Arabic */}
   </div>
   ```

2. **RTL-Specific Flex Direction**
   ```jsx
   <div className="flex flex-row rtl:flex-row-reverse">
     <StatusIcon />
     <StatusText />
   </div>
   ```

3. **Appropriate Spacing for Both Views**
   ```jsx
   <div className="space-x-2 rtl:space-x-reverse">
     {/* Status content */}
   </div>
   ```

4. **Min and Max Width Constraints for Desktop**
   ```jsx
   <div className="w-full md:min-w-[320px] md:max-w-[420px]">
     {/* Status content */}
   </div>
   ```

5. **Horizontal Button Alignment**
   ```jsx
   <div className="flex flex-col md:flex-row rtl:flex-row-reverse gap-2">
     {/* Action buttons */}
   </div>
   ```

6. **Class Name Merging**
   ```jsx
   import { cn } from '@/lib/utils';

   <div className={cn(
     "flex items-center",
     "rtl:flex-row-reverse",
     className
   )}>
     {/* Status content */}
   </div>
   ```

## Order Status Badge Implementation

The OrderStatusBadge component has been updated to support RTL layout for Arabic text:

```jsx
const OrderStatusBadge = ({ status, locale = 'ar', className }) => {
  const style = getOrderStatusStyle(status);
  const displayText = getOrderStatusDisplay(status, locale);
  const isRtl = locale === 'ar';
  
  return (
    <div 
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "flex items-center justify-center gap-2",
        isRtl && "rtl:flex-row-reverse",
        style.color,
        className
      )}
    >
      <StatusIcon status={status} />
      <span>{displayText}</span>
    </div>
  );
};
```

## Testing RTL Support

The test suite includes specific tests for RTL support:

1. Verification of Arabic text content
2. Checking for RTL-specific attributes and classes
3. Testing the component rendering in both LTR and RTL contexts

## Implementation Checklist

When implementing order status displays in components, ensure:

- [ ] The component uses `dir="rtl"` when displaying Arabic content
- [ ] Flex containers use `rtl:flex-row-reverse` for proper element ordering
- [ ] Spacing utilities include `rtl:space-x-reverse` for correct spacing
- [ ] The component uses the `cn()` utility for class name merging
- [ ] The component respects both mobile and desktop views

## Related Components

The following components have been updated to support RTL for order status:

1. OrderCard
2. OrderStatusBadge
3. OrderHeader
4. OrderFooter

All new components that display order status should follow these guidelines to ensure consistent RTL support across the platform.
