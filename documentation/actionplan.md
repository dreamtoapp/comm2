# Action Plan: Refactor Orders Management Dashboard with Analytics

This plan outlines the steps to refactor the orders management dashboard (`/dashboard/orders-management`) to include analytics reports with charts, acting as an admin user.

## Objective

Enhance the orders management page by adding visual analytics for sales trends, order distribution, and popular products using charts.

## Proposed Steps

1.  **Update Analytics Data Fetching:**
    *   Modify the existing server action `app/dashboard/orders-management/actions/analytics.ts` or create new actions to fetch the necessary data for the requested analytics:
        *   **Sales Trends:** Fetch aggregated sales data over time (e.g., daily, weekly, or monthly totals). This will involve querying the `Order` and potentially `OrderItem` models in Prisma, grouping by date, and summing up revenues.
        *   **Order Distribution:** Fetch data to represent the distribution of orders by their current status. The existing `fetchAnalytics` provides counts, but we might need data structured for charting (e.g., an array of objects like `{ status: 'PENDING', count: 50 }`).
        *   **Popular Products:** Fetch data on the top N most frequently ordered products. This will involve querying `OrderItem` models, grouping by product, and counting occurrences or summing quantities.
    *   Ensure the data fetching logic is efficient and handles potential errors gracefully.

2.  **Choose and Install Charting Library:**
    *   We will use **`recharts`** as the React charting library. It is a composable charting library built with React and D3.
    *   Installation will be performed using npm: `npm install recharts`.

3.  **Create Chart Components:**
    *   Create dedicated React components for each type of chart. A suggested location is `components/admin/dashboard/analytics/`.
    *   Examples:
        *   `components/admin/dashboard/analytics/SalesTrendChart.tsx`
        *   `components/admin/dashboard/analytics/OrderStatusChart.tsx`
        *   `components/admin/dashboard/analytics/PopularProductsChart.tsx`
    *   These components will be responsible for rendering the charts using `recharts` components (e.g., `LineChart`, `BarChart`, `PieChart`). They will receive the necessary data as props.

4.  **Integrate Charts into Orders Management Page:**
    *   Import the newly created chart components into `app/dashboard/orders-management/page.tsx`.
    *   Update the `OrdersManagementPage` component to call the modified/new analytics data fetching actions.
    *   Pass the fetched analytics data to the respective chart components.
    *   Arrange the chart components within the page layout to provide a clear overview of the analytics. This might involve creating a new section or grid layout for the charts.

5.  **Refinement and Styling:**
    *   Apply appropriate styling using Tailwind CSS to ensure the charts are visually integrated with the existing dashboard theme.
    *   Add tooltips, legends, and axes labels to the charts for better readability.
    *   Ensure responsiveness of the charts for different screen sizes.

## Implementation Notes

*   Server actions will be used for data fetching to leverage Next.js capabilities.
*   Consider data caching strategies if the analytics data doesn't need to be real-time on every page load.
*   Error handling should be implemented for data fetching and chart rendering.
*   The principle of "each route having its own component and actions" will be followed, with analytics actions potentially residing in `app/dashboard/orders-management/actions/analytics.ts` or a related file, and components within the `components/admin/dashboard/` structure.
*   `useActionState` will be preferred for any new or updated forms introduced as part of this refactoring, although this specific task focuses on data display rather than form interaction.

## Next Steps

Upon user confirmation of this plan, we will proceed to ACT MODE to implement the outlined steps.
