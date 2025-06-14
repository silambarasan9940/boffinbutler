"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import api from "@/services/api";
import { usePathname } from "next/navigation";
import ProductDetails from "@/components/product-details/ProductDetails";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/loader";
import { imageUrl } from "@/services/common";

const ProductDetailsPage = () => {
  const pathname = usePathname();

  const searchParams = useSearchParams();
  //const id = searchParams.get('id');
  const id = pathname;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    if (!id) return;
    try {
      const url_key = pathname.replace("/products/", "");
      const response = await api.get(`/product/${url_key}`);
      //const productid =  productData.data.id;
      // const response = await api.get(`/products/productbyid/${productid}`);
      console.log(" product by ID:", url_key);
      console.log(response.data, "gcsdhgbfjkdsnkfl");
      setProduct(response.data);
    } catch (err) {
      setError("Failed to fetch product details");
      console.log("Failed to fetch product details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">{error}</div>
    );
  }

  return (
    <>
      <Breadcrumbs />
      <div className="flex flex-row">
        <div className="w-full">
          <ProductDetails product={product} />
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
