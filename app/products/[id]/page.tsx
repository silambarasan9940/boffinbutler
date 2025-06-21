import { Metadata, ResolvingMetadata } from "next";
import ProductDetailsPage from "./product";
import api from "@/services/api";
import { imageUrl } from "@/services/common";

type Props = {
  params: { id: string };
};
// export const dynamic = "force-dynamic";
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rest/default/V1/product/${params.id}`,
      { next: { revalidate: 60 } } // optional caching
    );

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();

    return {
      title: data.name || "Product Details",
      description: data.description || "",
      keywords: data.keywords || "",
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${params.id}`,
      },
      openGraph: {
        title: data.name,
        description: data.description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${params.id}`,
        siteName: "Boffin Butler web page",
        images: [
          {
            url: `${imageUrl}logo/websites/1/BoffinButler_homepage_logo.png`,
            width: 1200,
            height: 630,
            alt: "Boffin Butler",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: data.name,
        description: data.description,
        images: [`${imageUrl}logo/websites/1/BoffinButler_homepage_logo.png`],
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);

    return {
      title: "Product Not Found",
      description: "The product could not be loaded.",
    };
  }
}

export default function Page() {
  return <ProductDetailsPage />;
}
