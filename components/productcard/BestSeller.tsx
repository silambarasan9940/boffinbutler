"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { imageUrl } from "@/services/common";
import RequestQuote from "../product-details/RequestQuote";

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
  gst: string;
  quantity_val: any;
  brand: any;
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
  quantity_val, 
  brand,
  url_key,
  isProductPage = false,
  isProductShadow = true,
  isProductPadding = true,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Function to navigate to the product details page
  const handleClick = () => {
    router.push(`/products/${url_key}?id=${entity_id}`);
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
    <div
      className={`${isProductPadding ? "p-4" : "p-1"} ${
        isProductPage ? "m-1" : "m-3"
      } bg-white ${isProductShadow ? "shadow-lg" : ""} rounded-xl text-left`}
      
    >
      <img
        src={`${imageUrl}catalog/product${image ? image : "/0/0/008-1.jpg"}`}
        alt={name}
        className="w-full h-48 object-cover mb-4 rounded-md"
        onClick={handleClick}
      />

      <div className="relative group">
        <h2 className="text-sm font-medium mb-2" onClick={handleClick}>{name.length < 29 ? name : name.substring(0,29)+'...'}</h2>
        <div className="absolute left-0 bottom-full mb-1 hidden max-w-xs break-words px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg group-hover:block">
          {name}
        </div>
      </div>

      <p className="flex justify-start mb-2">
        <span className="text-xs text-gray-500 line-through">
          {" "}
          ₹ {parseFloat(price).toFixed(2)} + {gst}% Gst
        </span>
        {offerprice && (
          <span className="ml-2 text-green-500 text-xs"> ₹ {offer_price}</span>
        )}
      </p>
      <p className="text-sm text-block mb-4 font-bold">
        ₹ {parseFloat(final_price).toFixed(2)}{" "}
        <span className="font-normal text-gray-400">(Incl. of all taxes)</span>
      </p>
      <button
            onClick={toggleModal}
            className="w-full bg-indigo-500 text-white font-normal py-2 px-4 rounded-full hover:bg-indigo-600 transition"
          >
            Request a Quote
      </button>
      
      {/* {showButton && (
        <button
          onClick={handleClick}
          className="w-full bg-white mt-3 text-customBlue border-2 border-customBlue py-2 px-4 rounded-full hover:text-white hover:bg-indigo-600 transition duration-300 cursor-pointer"
        >
          Add to Cart
        </button>
      )} */}
    </div>
    {
      isModalOpen && 
      <RequestQuote
      id={entity_id}
      name={name}
      qty_val={quantity_val}
      brand={brand}
      price={price}
      toggleModal={toggleModal}
    />
    }
    </>
  );
};

export default ProductDataBestSeller;
