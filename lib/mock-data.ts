/**
 * Mock data for the order management system
 * Used for UI development while database integration is being fixed
 */

import { OrderStatus } from '@/constant/order-status';

// Mock order type
export interface MockOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  isTripStart: boolean;
  resonOfcancel?: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
  shiftId?: string;
  driverId?: string;
  items: MockOrderItem[];
}

// Mock order item type
export interface MockOrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  productId: string;
  orderId: string;
}

// Generate mock orders
const generateMockOrders = (count: number, status: OrderStatus): MockOrder[] => {
  const orders: MockOrder[] = [];
  
  const customerNames = [
    'محمد العلي', 'أحمد الصالح', 'فاطمة الزهراء', 'سارة القحطاني', 
    'خالد المالكي', 'عبدالله السعيد', 'نورة العتيبي', 'هند الشمري',
    'عمر الدوسري', 'سلمان الحربي', 'لينا الغامدي', 'ريم العنزي'
  ];
  
  const productNames = [
    'ماء معدني كبير', 'ماء معدني صغير', 'مياه غازية', 'عصير برتقال',
    'عصير تفاح', 'مياه نكهة ليمون', 'مياه نكهة فراولة', 'مياه نكهة توت',
    'ماء معدني علبة', 'مياه غازية علبة', 'عصير مانجو', 'عصير فراولة'
  ];
  
  const cancelReasons = [
    'طلب العميل الإلغاء', 'المنتج غير متوفر', 'خطأ في العنوان',
    'تأخر التوصيل', 'مشكلة في الدفع', 'خارج نطاق التوصيل'
  ];
  
  for (let i = 0; i < count; i++) {
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const itemsCount = Math.floor(1 + Math.random() * 5);
    const items: MockOrderItem[] = [];
    let totalAmount = 0;
    
    for (let j = 0; j < itemsCount; j++) {
      const productName = productNames[Math.floor(Math.random() * productNames.length)];
      const quantity = Math.floor(1 + Math.random() * 5);
      const price = Math.floor(5 + Math.random() * 20);
      const itemTotal = quantity * price;
      totalAmount += itemTotal;
      
      items.push({
        id: `item-${i}-${j}-${Date.now()}`,
        productName,
        quantity,
        price,
        productId: `prod-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: `order-${i}-${Date.now()}`
      });
    }
    
    const order: MockOrder = {
      id: `order-${i}-${Date.now()}`,
      orderNumber,
      customerName,
      status,
      isTripStart: status === OrderStatus.INWAY,
      amount: totalAmount,
      createdAt: createdDate,
      updatedAt: new Date(),
      customerId: `cust-${Math.floor(1000 + Math.random() * 9000)}`,
      items
    };
    
    if (status === OrderStatus.INWAY || status === OrderStatus.DELIVERED) {
      order.driverId = `driver-${Math.floor(100 + Math.random() * 900)}`;
      order.shiftId = `shift-${Math.floor(100 + Math.random() * 900)}`;
    }
    
    if (status === OrderStatus.CANCELED) {
      order.resonOfcancel = cancelReasons[Math.floor(Math.random() * cancelReasons.length)];
    }
    
    orders.push(order);
  }
  
  return orders;
};

// Generate mock orders for each status
export const pendingOrders = generateMockOrders(45, OrderStatus.PENDING);
export const inWayOrders = generateMockOrders(25, OrderStatus.INWAY);
export const deliveredOrders = generateMockOrders(30, OrderStatus.DELIVERED);
export const canceledOrders = generateMockOrders(20, OrderStatus.CANCELED);

// All orders combined
export const allOrders = [...pendingOrders, ...inWayOrders, ...deliveredOrders, ...canceledOrders];

// Mock analytics data
export const mockAnalytics = {
  totalOrders: allOrders.length,
  pendingOrders: pendingOrders.length,
  inWayOrders: inWayOrders.length,
  deliveredOrders: deliveredOrders.length,
  canceledOrders: canceledOrders.length,
};

// Function to get mock orders with pagination
export const getMockOrders = (params: {
  status?: OrderStatus;
  page?: number;
  pageSize?: number;
  dateRange?: string;
  reason?: string;
}) => {
  const { status, page = 1, pageSize = 10, dateRange, reason } = params;
  
  // Filter by status if provided
  let filteredOrders = status 
    ? allOrders.filter(order => order.status === status)
    : allOrders;
  
  // Filter by date range if provided
  if (dateRange && dateRange !== 'all') {
    const now = new Date();
    const startDate = new Date();
    
    if (dateRange === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (dateRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (dateRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }
    
    filteredOrders = filteredOrders.filter(order => order.createdAt >= startDate);
  }
  
  // Filter by cancellation reason if provided
  if (reason && status === OrderStatus.CANCELED) {
    filteredOrders = filteredOrders.filter(order => 
      order.resonOfcancel && order.resonOfcancel.includes(reason)
    );
  }
  
  // Calculate pagination
  const totalCount = filteredOrders.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  
  return {
    orders: paginatedOrders,
    totalCount,
    totalPages,
    currentPage: page
  };
};
