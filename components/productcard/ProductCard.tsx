"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-multi-carousel/lib/styles.css";
import ProductData from "./ProductData";
import api from "@/services/api";

const Carousel = dynamic(() => import("react-multi-carousel"), { ssr: false });

interface Product {
  _id: string;
  sku: string;
  price: string;
  headline: string;
  image: string;
  originalprice: string;
  offerprice: string;
  url_key: string;
}

const ProductCard: React.FC<{
  title: string;
  showAddToCartButton?: boolean;
  category_id: string;
  showQouteButton?: boolean;
}> = ({
  title,
  showAddToCartButton = false,
  showQouteButton = true,
  category_id,
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch Product Data
  const fetchProductDataList = async () => {
    const searchParams = {
      page: 1,
      size: 20,
      query: "*",
      caregory_id: category_id,
    };
    try {
      const response = await api.post("/search/products", { searchParams });
      setProducts(response.data[0].results);
    } catch (error) {
      console.log("loading failed fetch product list", error);
    }
  };

  useEffect(() => {
    fetchProductDataList();
  }, []);
  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
    medium: { breakpoint: { max: 1024, min: 769 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">{title}</h2>
      <Carousel
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={4000}
      >
        {products.map((product, index) => (
          <ProductData
            key={index}
            {...product}
            showButton={showAddToCartButton}
            id={product._id}
            showQuoteBtn={showQouteButton}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCard;
