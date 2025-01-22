import { Metadata } from "next";
import api from "@/services/api";

export async function generateMetadata(id: string): Promise<Metadata> {
  try {
    const response = await api.get(`/products/productbyid/${id}`);
    const product = response.data;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    return {
      title: product?.name || "Default Title",
      description: product?.excerpt || "Default description",
      alternates: {
        canonical: `${baseUrl}/products/productbyid/${id}`,
      },
      openGraph: {
        title: product?.name || "Default Title",
        description: product?.excerpt || "Default description",
        url: `${baseUrl}/products/productbyid/${id}`,
        images: product?.coverImage
          ? [
              {
                url: product.coverImage,
                width: 1200,
                height: 630,
                alt: product.name,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product?.name || "Default Title",
        description: product?.excerpt || "Default description",
        images: [product?.coverImage || ""],
      },
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
    return {
      title: "Default Title",
      description: "Default description",
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products/productbyid/${id}`,
      },
    };
  }
}
