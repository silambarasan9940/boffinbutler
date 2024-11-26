
import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import ProductData from '@/components/productcard/ProductData';
interface Product {
//   product_id: string;
//   attribute_set_id: string;
//   type_id: string;
//   sku: string;
//   has_options: string;
//   required_options: string;
//   created_at: string;
//   updated_at: string;
//   mst_search_weight: string;
//   productcode: string;
//   image:string;
_source:any;
}

const SimilarProducts: React.FC<{ sku: string; productcode: string }> = ({
  sku,
  productcode,
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchSimilarProducts = async () => {
    try {
      const response = await api.post('/similarproducts', {
        sku:sku,
        product_code: productcode,
      });
      setProducts(response.data[0].results); 
      console.log(response.data[0].results , "response checked");
    } catch (error) {
      console.error('Failed to load products', error);
    }
  };

  useEffect(() => {
    fetchSimilarProducts();
  }, [sku, productcode]);

  return (
    <div>
        <h2 className='text-2xl font-semibold py-3 border-b border-gray-300'>Similar Products</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 pt-3">
      {products.map((product, index) => (
        <ProductData key={product._source?.product_id} {...product} showButton={false} id={product._source?.product_id} />
      ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
