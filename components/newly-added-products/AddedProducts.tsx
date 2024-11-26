import React from 'react';
import Image from 'next/image'
import { imageUrl } from '@/services/common';
import { useRouter } from "next/navigation";

interface AddProductCardProps {
  entity_id:string;
  sku: string;
  price: string;
  final_price: string;
  name: string;
  special_price: string;
  image:string
  url_key:string;
  showButton: boolean;
  imagePosition: 'left' | 'right'; 
}

const AddProductCard: React.FC<AddProductCardProps> = ({
  entity_id,
  sku,
  price,
  final_price,
  name,
  special_price,
  image,
  url_key,
  showButton,
  imagePosition,
}) => {
  const router = useRouter();
   // Function to navigate to the product details page
   const handleClick = () => {
    router.push(`/products/${url_key}?id=${entity_id}`);
  };

  return (
    
    <div className="flex items-center w-full">
      {imagePosition === 'left' && (
        <Image src={`${imageUrl}catalog/product{image}`}
         alt={name} className="w-1/2 bg-gray-100 h-full cursor-pointer" 
         width={200} height={200} 
         onClick={handleClick}
         />
      )}
      <div className="flex flex-col items-center justify-center bg-gray-100 h-full p-4 w-full">
        <h2 className='text-sm font-medium mb-2 text-center cursor-pointer' onClick={handleClick}>{name}</h2>
        
        <div className='flex'>
        <p className="text-xs text-gray-500 line-through">₹ {parseFloat(price).toFixed(2)}</p>
        <p className="ml-2 text-green-500 text-xs">₹ {parseFloat(price).toFixed(2)}</p>
        </div>
        <p className="text-sm text-block mb-4 pt-4">₹ {parseFloat(final_price).toFixed(2)}</p>
        {showButton && (
      <button className="w-full bg-white text-customBlue border-2 border-customBlue py-2 px-4 rounded-full hover:text-white hover:bg-indigo-600 transition duration-300">
        Add to Cart
      </button>
    )}
      </div>
      {imagePosition === 'right' && (
        <Image src={image} alt={name} className="w-1/2 bg-gray-100 h-full cursor-pointer" width={200} height={200}  onClick={handleClick} />
      )}
    </div>
  );
};

export default AddProductCard;
