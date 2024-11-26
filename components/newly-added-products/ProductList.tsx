"use client";
import React, { useEffect, useState } from 'react';
import AddProductCard from '../newly-added-products/AddedProducts';
import api from '@/services/api';

interface ProductItem {
  entity_id: string;
  sku: string;
  price: string;
  final_price: string;
  name: string;
  image: string;
  url_key:string;
  special_price: string;
  imagePosition: 'left' | 'right';
}


const ProductList = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);

  const fetchNewProductData = async () => {
    try {
      
      const response = await api.get('/productblocks/3');
      setProducts(response.data[0].items);
    } catch (error) {
      console.log('Failed to load data', error);
    }

  };

  useEffect(() => {
    fetchNewProductData();
  }, []);

  return (
    <>
      <h2 className="text-center text-3xl font-semibold py-8">
        NEWLY ADDED PRODUCTS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {products.slice(0, 4).map((product, index) => ( 
          <div
            key={index}
            className={`flex ${index === 0 || index === 2 ? 'justify-end' : ''} ${index === 1 || index === 3 ? 'justify-start' : ''}`}
          >
            <AddProductCard
              image={product.image}
              name={product.name}
              entity_id={product.entity_id}
              final_price={product.final_price}
              price={product.price}
              special_price={product.special_price}
              sku={product.sku}
              url_key={product.url_key}
              showButton={false}
              imagePosition={index === 2 || index === 3 ? 'right' : 'left'}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
