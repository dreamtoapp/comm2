# Prisma Order Status Action Plan

## Issue Description
The `prisma.order.groupBy` invocation in the `getDashboardSummary` function is causing a `PrismaClientValidationError` due to an `undefined` value in the `in` array for the `status` field. This is likely due to a typo or missing enum value for `OrderStatusEnum.INWAY`.

## Action Plan

### 1. Identify the Source of the `undefined` Value
- **Inspect the `OrderStatusEnum`**: Check the definition of `OrderStatusEnum` to ensure all expected status values are correctly defined.
- **Check for Typos**: Verify that `OrderStatusEnum.INWAY` is correctly spelled and matches the enum definition.

### 2. Correct the Enum Values
- **Update Enum Definition**: If `OrderStatusEnum.INWAY` is missing or incorrectly defined, update the enum definition to include the correct value.
- **Filter Out `undefined` Values**: Ensure that any array used in the `in` clause filters out `undefined` values to prevent the error.

### 3. Simplify Order Status Handling
- **Use Enum Values Directly**: Ensure that all status values used in queries are directly referenced from the enum to avoid typos and ensure consistency.
- **Add Validation**: Add validation to check for `undefined` values before performing database operations.

## Detailed Steps

### Step 1: Inspect the `OrderStatusEnum`
- **Location**: `@prisma/client`
- **Action**: Open the `OrderStatusEnum` definition and verify that all expected status values are present and correctly spelled.

### Step 2: Correct the Enum Values
- **Location**: `lib/dashboardSummary.ts`
- **Action**: Update the `getDashboardSummary` function to ensure all status values are valid enum values.
  ```typescript
  const statusCounts = await db.order.groupBy({
    by: ['status'],
    _count: { _all: true },
    where: {
      status: {
        in: [
          OrderStatusEnum.PENDING,
          OrderStatusEnum.IN_TRANSIT, // Correct enum value
          OrderStatusEnum.DELIVERED,
          OrderStatusEnum.CANCELED
        ]
      }
    }
  });
  ```

### Step 3: Simplify Order Status Handling
- **Location**: `lib/dashboardSummary.ts`
- **Action**: Add validation to filter out `undefined` values.
  ```typescript
  const validStatuses = [
    OrderStatusEnum.PENDING,
    OrderStatusEnum.IN_TRANSIT, // Correct enum value
    OrderStatusEnum.DELIVERED,
    OrderStatusEnum.CANCELED
  ].filter(status => status !== undefined);

  const statusCounts = await db.order.groupBy({
    by: ['status'],
    _count: { _all: true },
    where: {
      status: {
        in: validStatuses
      }
    }
  });
  ```

## Conclusion
By following these steps, we can ensure that the `prisma.order.groupBy` invocation uses valid enum values and avoids the `PrismaClientValidationError`. This will simplify the order status handling and make the code more robust.
