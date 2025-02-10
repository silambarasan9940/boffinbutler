
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Topheader from "@/components/header/top-header/Topheader";
import Navbar from "@/components/header/Appbar/Navbar";
import Footer from "@/components/footer/Footer";
import ReduxProvider from "@/components/redux-provider/ReduxProvider"; 
import { imageUrl } from "@/services/common";
// import { NextSeo } from "next-seo";
// import SEO from "@/next-seo.config";

// Define local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define the metadata for the app

export const metadata: Metadata = {
  title: "BOFFIN BUTLER PRIVATE LIMITED - HOME",
  description:
    "Boffin Butler - Your one-stop destination for laboratory requirements, offering a wide range of general and fine chemicals, bio-reagents, nanotechnology products, cell culture media, analysis kits, glassware, plasticware, instruments, and equipment. Explore our extensive catalog and streamline your laboratory procurement process today!",
  keywords:
    "laboratory requirements,chemicals, lab chemicals, general and fine chemicals, bio-reagents, nanotechnology products, cell culture media, analysis kits, glassware, plasticware, instruments, and equipment",
    alternates: {
      canonical: "https://media.boffinbutler.com",
    },
    // icons: {
    //   icon: "/favicon.ico", 
    //   shortcut: "/favicon.ico",
    //   apple: "/favicon.ico", 
    // },
    openGraph: {
    title: "BOFFIN BUTLER PRIVATE LIMITED - HOME",
    description:
      "Boffin Butler - Your one-stop destination for laboratory requirements, offering a wide range of general and fine chemicals, bio-reagents, nanotechnology products, cell culture media, analysis kits, glassware, plasticware, instruments, and equipment. Explore our extensive catalog and streamline your laboratory procurement process today!",
    url: "https://media.boffinbutler.com",
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
    title: "Boffin Butler",
    description: "Boffin Butler - Your one-stop destination for laboratory requirements, offering a wide range of general and fine chemicals, bio-reagents, nanotechnology products, cell culture media, analysis kits, glassware, plasticware, instruments, and equipment. Explore our extensive catalog and streamline your laboratory procurement process today!",
    images: [`${imageUrl}logo/websites/1/BoffinButler_homepage_logo.png`],
  },
};


// RootLayout component to wrap all pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* <NextSeo {...SEO} /> */}
        <ReduxProvider>
          {/* Ensure Redux context is available for all children */}
          
          <div className="w-full bg-white">
            <div className="fixed top-0 left-0 w-full z-[9999] mx-auto">
              <Topheader />
              <Navbar />
            </div>
            <div className="min-h-screen w-full pt-[125px] md:pt-[145px] xl:pt-[105px]">
              {children}
            </div>
            <div className="w-full bg-white">
              <Footer />
            </div>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
