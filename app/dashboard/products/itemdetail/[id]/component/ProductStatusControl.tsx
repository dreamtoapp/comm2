'use client';
import { useState } from 'react';

import PublishStatusButton from './PublishStatusButton';
import StockStatusButton from './StockStatusButton';

interface Product {
  id: string;
  name: string;
  published: boolean;
  outOfStock: boolean;
}

interface ProductStatusControlProps {
  product: Product;
}

export default function ProductStatusControl({ product }: ProductStatusControlProps) {
  const [published, setPublished] = useState(product.published);
  const [outOfStock, setOutOfStock] = useState(product.outOfStock);


  const handlePublish = (publish: boolean) => {
    setPublished(publish);
    // Call server logic here

  };

  const handleStock = (stock: boolean) => {
    setOutOfStock(stock);
    // Call server logic here

  };



  return (
    <div className='flex gap-2'>
      <PublishStatusButton
        published={published}
        productName={product.name}
        productId={product.id}
        onStatusChange={handlePublish}
      />
      <StockStatusButton
        outOfStock={outOfStock}
        productName={product.name}
        productId={product.id}
        onStatusChange={handleStock}
      />
    </div>
  );
}
