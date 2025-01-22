// next-seo.config.ts
import { NextSeoProps } from "next-seo";
export default {
    title: "BOFFIN BUTLER PRIVATE LIMITED - HOME",
    description: "Boffin Butler - Your one-stop destination for laboratory requirements, offering a wide range of general and fine chemicals, bio-reagents, nanotechnology products, cell culture media, analysis kits, glassware, plasticware, instruments, and equipment. Explore our extensive catalog and streamline your laboratory procurement process today!",
   keywords: "laboratory requirements,chemicals, lab chemicals, general and fine chemicals, bio-reagents, nanotechnology products, cell culture media, analysis kits, glassware, plasticware, instruments, and equipment",
   canonical: "https://media.boffinbutler.com",
    openGraph: {
      type: "website",
      url: "https://media.boffinbutler.com",
      title: "BOFFIN BUTLER PRIVATE LIMITED - HOME",
      description: "Boffin Butler - Your one-stop destination for laboratory requirements, offering a wide range of general and fine chemicals, bio-reagents, nanotechnology products, cell culture media, analysis kits, glassware, plasticware, instruments, and equipment. Explore our extensive catalog and streamline your laboratory procurement process today!",
      images: [
        {
          url: "https://media.boffinbutler.com/media/logo/websites/1/BoffinButler_homepage_logo.png",
          width: 800,
          height: 600,
          alt: "Boffin Butler",
        },
      ],
    }
  } as NextSeoProps;
  

  