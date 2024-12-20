"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-multi-carousel/lib/styles.css";
import ProductDataBestSeller from "./BestSeller";
import api from "@/services/api";

const Carousel = dynamic(() => import("react-multi-carousel"), { ssr: false });

interface Product {
  entity_id: string;
  sku: string;
  price: string;
  headline: string;
  image: string;
  originalprice: string;
  offerprice: string;
  url_key: string;
  name: string;
}

interface BestSellerCardProps {
  showAddToCartButton?: boolean;
  showQouteButton?: boolean;
}

const BestSellerCard = ({
  showAddToCartButton = false,
  showQouteButton = false,
}: BestSellerCardProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState();
  const fetchBestSellerData = async () => {
    try {
      //const titletext = '';
      const response = await api.get("/productblocks/3");
      // Ensure response.data[0].items is an array
      if (Array.isArray(response.data[0]?.items)) {
        setProducts(response.data[0].items);
        setTitle(response.data[0].name);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("Failed to load data", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchBestSellerData();
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
        {products.map((product: Product, index: number) => (
          <ProductDataBestSeller
            key={product.entity_id || index}
            {...product}
            showButton={showAddToCartButton}
            entity_id={product.entity_id}
            showQouteBtn={showQouteButton}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default BestSellerCard;
