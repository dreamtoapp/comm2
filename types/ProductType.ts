export interface ProductType {
  id: string;
  name: string;
  price: number;
  details?: string; // Changed from string | null to optional string
  size?: string; // Changed from string | null to optional string
  published: boolean;
  outOfStock: boolean;
  imageUrl: string;
  type: string;
  supplier?: { // Add optional supplier info
    id: string;
    name: string;
  };
}
