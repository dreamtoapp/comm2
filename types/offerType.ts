export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  active: boolean;
  productIds: string[];
}
