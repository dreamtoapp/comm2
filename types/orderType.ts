import { OrderStatus } from '@/constant/order-status';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  latitude: string;
  longitude: string;
}

interface Shift {
  id: string;
  name: string;
}

export interface Order1 {
  id: string;
  orderNumber: string;
  customerId: string;
  shiftId: string;
  customer: Customer;
  shift: Shift;
  items: OrderItem[];
  latitude?: string | null;
  longitude?: string | null;
  createdAt: Date;
  amount: number;
  status: OrderStatus; // Added status field with OrderStatus enum
  driver: {
    id: string;
    name: string;
    phone: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  isTripStart: boolean;
  customerId: string;
  customerName: string | null;
  shiftId: string;
  driverId: string | null;
  status: OrderStatus; // Updated to use OrderStatus enum
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: Product | null;
  }[];
  customer: {
    id: string;
    phone: string | null;
    name: string | null;
    address: string | null;
    latitude: string;
    longitude: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
  } | null;
  shift: { name: string; id: string };
}
