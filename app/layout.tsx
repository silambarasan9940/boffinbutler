
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Topheader from "@/components/header/top-header/Topheader";
import Navbar from "@/components/header/Appbar/Navbar";
import Footer from "@/components/footer/Footer";
import ReduxProvider from "@/components/redux-provider/ReduxProvider";

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
  description: "Boffin Butler - Your one-stop destination for laboratory requirements, offering a wide range of general and fine chemicals, bio-reagents, nanotechnology products, cell culture media, analysis kits, glassware, plasticware, instruments, and equipment. Explore our extensive catalog and streamline your laboratory procurement process today!",
  keywords: "laboratory requirements,chemicals, lab chemicals, general and fine chemicals, bio-reagents, nanotechnology products, cell culture media, analysis kits, glassware, plasticware, instruments, and equipment"
};

// RootLayout component to wrap all pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="w-full bg-white">
          <div className="fixed top-0 left-0 w-full z-[9999] mx-auto">
            <Topheader />
            <Navbar />
          </div>
          <div className="min-h-screen w-full pt-[125px] md:pt-[145px] xl:pt-[105px]">
            {/* Wrap children with ReduxProvider to ensure Redux is used client-side */}
            
              {children}
            
          </div>
          <div className="w-full bg-white">
            <Footer />
          </div>
          
        </div>
      </body>
    </html>
    </ReduxProvider>
  );
}
