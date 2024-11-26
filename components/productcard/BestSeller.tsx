"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { imageUrl } from "@/services/common";

// Type for Product Props
interface Product {
 entity_id: string;
  price: string;
  name: string;
  image: string;
  originalprice: string;
  offerprice: string | null;
  sku: string;
  url_key: string;
  final_price: string;
  gst:string;
}

// Props type for ProductData component
interface ProductDataProps extends Product {
  showButton?: boolean;
  isProductPage?: boolean;
  isProductShadow?: boolean;
  isProductPadding?: boolean;
}

const ProductDataBestSeller: React.FC<ProductDataProps> = ({
 entity_id,
  name,
  image,
  price,
  originalprice,
  offerprice,
  final_price,
  showButton,
  sku,
  gst,
  url_key,
  isProductPage = false,
  isProductShadow = true,
  isProductPadding = true,
}) => {
  const router = useRouter();

  // Function to navigate to the product details page
  const handleClick = () => {
    router.push(`/products/${url_key}?id=${entity_id}`);
  };

  return (
    <div
      className={`${isProductPadding ? 'p-4' : 'p-1'} ${isProductPage ? "m-1" : "m-3"} bg-white ${isProductShadow ? 'shadow-lg' : ''} rounded-xl text-left`} 
      onClick={handleClick}
    >
      <img
        src={`${imageUrl}catalog/product${image ? image : '/0/0/008-1.jpg'}`}
        alt={name}
        className="w-full h-48 object-cover mb-4 rounded-md"
      />
      <h2 className="text-sm font-medium mb-2">{name}</h2>
      <p className="flex justify-start mb-2">
        <span className="text-xs text-gray-500 line-through"> ₹ {parseFloat(price).toFixed(2)} + {gst}% Gst</span>
        {offerprice && <span className="ml-2 text-green-500 text-xs"> ₹ {offer_price}</span>}
      </p>
      <p className="text-sm text-block mb-4 font-bold">
        ₹ {parseFloat(final_price).toFixed(2)} <span className="font-normal text-gray-400">(Incl. of all taxes)</span>
      </p>
      {showButton && (
        <button
          onClick={handleClick}
          className="w-full bg-white text-customBlue border-2 border-customBlue py-2 px-4 rounded-full hover:text-white hover:bg-indigo-600 transition duration-300 cursor-pointer"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductDataBestSeller;
