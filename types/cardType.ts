// helper/orderType.ts
// Using string values for order status

'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  status: string; // Order status as string value
  isTripStart: boolean;
  resonOfcancel?: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod?: string;
  deliveredAt?: Date;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      price: number;
      images: string[];
    };
  }>;
  customer: {
    phone: string;
    name: string;
    email: string; // Added email based on fetchOrders select
    address: string | undefined;
    latitude: string;
    longitude: string;
  };
  driver: {
    id: string; // Added id based on fetchOrders include
    name: string;
    phone: string;
  } | null;
  orderInWay: any; // Added orderInWay field
  driverId: string | null; // Kept driverId but made optional
}
