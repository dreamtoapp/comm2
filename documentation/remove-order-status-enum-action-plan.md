# Action Plan to Remove OrderStatusEnum from Prisma Schema

## Objective
Remove the `OrderStatusEnum` from the Prisma schema and use a constant enum for order statuses throughout the codebase.

## Action Plan

### 1. Remove `OrderStatusEnum` from Prisma Schema
- **Location**: `prisma/schema.prisma`
- **Action**: Remove the `OrderStatusEnum` definition from the Prisma schema.
  ```prisma
  // Remove this enum definition
  // enum OrderStatusEnum {
  //   PENDING
  //   IN_WAY
  //   Delivered
  //   CANCELED
  // }
  ```

### 2. Define a Constant Enum for Order Statuses
- **Location**: `constant/order-status.ts`
- **Action**: Define a constant enum for order statuses.
  ```typescript
  export const ORDER_STATUS = {
    PENDING: 'PENDING',
    IN_TRANSIT: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED',
    CANCELED: 'CANCELED',
  } as const;

  export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
  ```

### 3. Update All Relevant Code to Use the New Constant Enum
- **Location**: Throughout the codebase
- **Action**: Update all references to `OrderStatusEnum` to use the new constant enum `ORDER_STATUS`.

#### Example: Updating `lib/dashboardSummary.ts`
  ```typescript
  import { ORDER_STATUS, OrderStatus } from '@/constant/order-status';

  // Update the statusCounts query
  const statusCounts = await db.order.groupBy({
    by: ['status'],
    _count: { _all: true },
    where: {
      status: {
        in: [ORDER_STATUS.PENDING, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELED]
      }
    }
  });

  // Update the recentOrders query
  const recentOrders = await db.order.findMany({
    where: {
      status: {
        in: [ORDER_STATUS.PENDING, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELED]
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });
  ```

#### Example: Updating Order Model
  ```typescript
  import { ORDER_STATUS, OrderStatus } from '@/constant/order-status';

  model Order {
    // ... other fields ...
    status OrderStatus @default(ORDER_STATUS.PENDING)
    // ... other fields ...
  }
  ```

## Detailed Steps

### Step 1: Remove `OrderStatusEnum` from Prisma Schema
1. Open `prisma/schema.prisma`.
2. Remove the `OrderStatusEnum` definition.
3. Save the changes.

### Step 2: Define a Constant Enum for Order Statuses
1. Create or update `constant/order-status.ts`.
2. Define the constant enum `ORDER_STATUS`.
3. Save the changes.

### Step 3: Update All Relevant Code to Use the New Constant Enum
1. Search for all instances of `OrderStatusEnum` in the codebase.
2. Update each instance to use the new constant enum `ORDER_STATUS`.
3. Ensure that all queries and type references are updated accordingly.
4. Save the changes.

## Conclusion
By following these steps, we can remove the `OrderStatusEnum` from the Prisma schema and use a constant enum for order statuses throughout the codebase. This will simplify the order status handling and make the code more robust.
