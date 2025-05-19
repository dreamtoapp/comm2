export interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  customer: {
    phone: string;
    name: string;
    address: string | null; // Changed from `string | undefined` to `string | null`
    latitude: string;
    longitude: string;
  };
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}
