"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { imageUrl } from "@/services/common";
import RequestQuote from "../product-details/RequestQuote";

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
  showQuoteBtn?: boolean;
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
  showQuoteBtn = true
  
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Function to navigate to the product details page
  const handleClick = () => {
    router.push(`/products/${_source.url_key}`);
  };
  const toggleModal = (event) => {
    event.preventDefault(); // Prevents the default action
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
    <div
      className={`${isProductPadding ? 'p-4' : 'p-1'} ${isProductPage ? "m-1" : "m-3"} bg-white ${isProductShadow ? 'shadow-lg' : ''} rounded-xl text-left min-h-80 cursor-pointer`} 
      onClick={handleClick}
    >
      <img
        src={`${imageUrl}catalog/product${_source?.image ? _source?.image : '/0/0/008-1.jpg'}`}
        alt={name}
        className="w-full h-48 object-cover mb-4 rounded-md cursor-pointer"
        onClick={handleClick}
      />
      <div className="relative group">
        <h2 className="text-sm font-medium mb-2 cursor-pointer"
        onClick={handleClick}
        >{_source?.name.length < 27 ? _source?.name : _source?.name.substring(0,24)+'...'}</h2>
        <div className="absolute left-0 bottom-full mb-1 hidden max-w-xs break-words px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg group-hover:block">
          {_source?.name}
        </div>
      </div>
      
      <p className="flex justify-start mb-2">
        <span className="text-xs text-gray-500 line-through"> ₹ {_source?.price} + Gst</span>
        {_source?.offerprice && <span className="ml-2 text-green-500 text-xs"> ₹ {_source?.offer_price}</span>}
      </p>
      <p className="text-sm text-block mb-4 font-bold">
        ₹ {_source?.special_price} <span className="font-normal text-gray-400">(Incl. of all taxes)</span>
      </p>
     {showQuoteBtn && <button
            onClick={toggleModal}
            className="w-full bg-indigo-500 text-white font-normal mb-3 py-2 px-4 rounded-full hover:bg-indigo-600 transition"
          >
            Request a Quote
      </button>}
     
      {/* {showButton && (
        <button
          onClick={handleClick}
          className="w-full bg-white text-customBlue border-2 border-customBlue py-2 px-4 rounded-full hover:text-white hover:bg-indigo-600 transition duration-300 cursor-pointer"
        >
          Add to Cart
        </button>
      )} */}
    </div>
    {
      isModalOpen && 
      <RequestQuote
      id={_source?.product_id}
      name={_source?.name}
      qty_val={_source?.quantity_val}
      brand={_source?.product_brand}
      price={_source?.price}
      toggleModal={toggleModal}
    />
    }
    </>
  );
};

export default ProductData;
