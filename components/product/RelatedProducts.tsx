'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getRelatedProducts } from '@/app/(e-comm)/product/actions/related';
import { Product } from '@/types/product'; // Import shared Product type



interface RelatedProductsProps {
  currentProductId: string;
  supplierId?: string;
}

export default function RelatedProducts({ currentProductId, supplierId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]); // Use shared Product type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        if (!supplierId) {
          setLoading(false);
          return;
        }

        // Fetch related products using server action
        const relatedProducts = await getRelatedProducts(supplierId, currentProductId, 4);
        setProducts(relatedProducts.map(product => ({
          ...product,
          details: product.details === null ? undefined : product.details,
          size: product.size === null ? undefined : product.size,
          rating: product.rating === null ? undefined : product.rating,
          imageUrl: product.imageUrl === null || product.imageUrl === undefined ? null : product.imageUrl,
          images: Array.isArray(product.images) ? product.images.filter(Boolean) : [],
        })));

      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [currentProductId, supplierId]);

  if (loading) {
    return (
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {[...Array(4)].map((_, index) => (
          <div key={index} className='h-80 animate-pulse rounded-md bg-muted'></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          className=""
          quantity={1}
          onQuantityChange={() => {}}
          onAddToCart={() => {}}
          isInCart={false}
        />
      ))}
    </div>
  );
}
