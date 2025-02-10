import { Metadata, ResolvingMetadata } from 'next'
import ProductDetailsPage from './product'
import api from '@/services/api';
import { imageUrl } from '@/services/common';

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch product data
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rest/default/V1/product/${params.id}`);
const data = await response.json();
 console.log(data);
  return {
     title: data.name,
      description: data.description,
      keywords: data.keywords,
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${params.id}`,
        },
        // icons: {
        //   icon: "/favicon.ico", 
        //   shortcut: "/favicon.ico",
        //   apple: "/favicon.ico", 
        // },
        openGraph: {
        title: data.name,
        description:data.description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${params.id}`,
        siteName: "Boffin Butler",
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
  }
}

export default function Page() {
    return <ProductDetailsPage />
  }