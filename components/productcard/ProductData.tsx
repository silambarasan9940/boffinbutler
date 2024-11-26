"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { imageUrl } from "@/services/common";

// Type for Product Props
interface Product {
  id: string;
  price: string;
  name: string;
  image: string;
  originalprice: string;
  offerprice: string | null;
  sku: string;
  url_key: string;
  _source:any;

}

// Props type for ProductData component
interface ProductDataProps extends Product {
  showButton?: boolean;
  isProductPage?: boolean;
  isProductShadow?: boolean;
  isProductPadding?: boolean;
}

const ProductData: React.FC<ProductDataProps> = ({
  id,
  name,
  image,
  price,
  originalprice,
  offerprice,
  showButton,
  sku,
  url_key,
  _source,
  isProductPage = false,
  isProductShadow = true,
  isProductPadding = true,
}) => {
  const router = useRouter();

  // Function to navigate to the product details page
  const handleClick = () => {
    router.push(`/products/${_source.url_key}?id=${id}`);
  };

  return (
    <div
      className={`${isProductPadding ? 'p-4' : 'p-1'} ${isProductPage ? "m-1" : "m-3"} bg-white ${isProductShadow ? 'shadow-lg' : ''} rounded-xl text-left`} 
      onClick={handleClick}
    >
      <img
        src={`${imageUrl}catalog/product${_source?.image ? _source?.image : '/0/0/008-1.jpg'}`}
        alt={name}
        className="w-full h-48 object-cover mb-4 rounded-md"
      />
      <h2 className="text-sm font-medium mb-2">{_source?.name}</h2>
      <p className="flex justify-start mb-2">
        <span className="text-xs text-gray-500 line-through"> ₹ {_source?.price} + Gst</span>
        {_source?.offerprice && <span className="ml-2 text-green-500 text-xs"> ₹ {_source?.offer_price}</span>}
      </p>
      <p className="text-sm text-block mb-4 font-bold">
        ₹ {_source?.special_price} <span className="font-normal text-gray-400">(Incl. of all taxes)</span>
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

export default ProductData;
