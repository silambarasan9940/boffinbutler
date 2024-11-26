"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsChevronDown } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import ProductSearchBar from "@/components/header/Appbar/ProductSearchBar";
import ProductIcon from "@/components/header/Appbar/ProductIcon";
import api from "@/services/api";


interface ProductLink {
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  product_count: number;
  url_key: string;
  children_data: ProductLink[]; 
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [productLinks, setProductLinks] = useState<ProductLink[]>([]);


  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const links = [
    { href: "/", label: "Home" },
    { href: "#", label: "Products", hasDropdown: true },
    { href: "/blogs", label: "Blogs" },
    { href: "/freebies", label: "Freebies" },
    { href: "/brands", label: "Brands" },
    { href: "/inquire-now", label: "Inquire Now" },
  ];

  const handleLinkClick = (label: string, isProductLink: boolean = false) => {
    setActiveLink(label);
    if (isProductLink) setIsDropdownOpen(false);
    setIsOpen(false); 
  };

  // Fetch product links from API
  useEffect(() => {
    const fetchProductLinks = async () => {
      try {
        const response = await api.get("/fetch/categories");
        const products = response.data[0][0].children; 
        setProductLinks(products); 
      } catch (error) {
        console.error("Error fetching product links:", error);
      }
    };

    fetchProductLinks();
  }, []);

  // Check the current pathname for active link
  useEffect(() => {
    const currentPath = window.location.pathname;
    const active = links.find((link) => link.href === currentPath);
    if (active) setActiveLink(active.label);
  }, []);

  return (
    <div className="py-3 bg-white shadow">
      <nav className="flex flex-col md:flex-row items-center justify-between px-4 mx-auto w-11/12">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="https://boffinbutler.com/">
            <Image
              src="https://media.boffinbutler.com/media/logo/websites/1/BoffinButler_homepage_logo.png"
              alt="BoffinButler Pvt Ltd"
              width={100}
              height={50}
            />
          </Link>
          {links.map((link) => (
            <div key={link.label} className="relative">
              {link.hasDropdown ? (
                <button
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  aria-controls="product-dropdown"
                  className="flex items-center text-gray-800 hover:text-customBlue dark:hover:text-white px-3 py-2 rounded-md text-base font-medium uppercase"
                >
                  {link.label}
                  <BsChevronDown
                    className={`ml-1 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className={`${
                    activeLink === link.label
                      ? "bg-white text-customBlue font-bold"
                      : "text-gray-800 hover:text-customBlue dark:hover:text-white"
                  } block px-3 py-2 rounded-md text-base font-medium uppercase`}
                  onClick={() => handleLinkClick(link.label)}
                >
                  {link.label}
                </Link>
              )}
              {isDropdownOpen && link.hasDropdown && (
                <div
                  id="product-dropdown"
                  className="absolute left-0 z-10 w-72 mt-2 bg-white border rounded-md shadow-lg"
                >
                  {productLinks.map((products) => (
                    <Link
                      key={products.id} 
                      href={`/products/categories/${products.url_key}`} 
                      className="block px-4 py-2 text-gray-800 hover:bg-indigo-100 text-md"
                      onClick={() => handleLinkClick(products.name, true)} 
                    >
                      {products.name} 
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* Right Side Elements (Search Bar and Cart Icon) */}
          <div className="flex items-center space-x-2">
              <ProductSearchBar />
              <ProductIcon
                icon={<FaShoppingCart size={16} />}
                notificationCount={5}
                bgColor="bg-indigo-500"
                notificationBgColor="bg-yellow-500"
              />
            </div>
        </div>

        {/* Mobile Header */}
        <div className="flex items-center justify-between w-full h-16 md:hidden">
          <div className="flex justify-between w-full">
            <div className="flex">
              <button
                onClick={toggleMenu}
                className="text-gray-800 hover:text-gray-600 mr-2"
              >
                {isOpen ? (
                  <MdClose size={24} />
                ) : (
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="w-6 h-6"
                    viewBox="0 0 1792 1792"
                  >
                    <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
                  </svg>
                )}
              </button>

              <Link href="https://boffinbutler.com/" className="flex-shrink-0">
                <Image
                  src="https://media.boffinbutler.com/media/logo/websites/1/BoffinButler_homepage_logo.png"
                  alt="BoffinButler Pvt Ltd"
                  width={100}
                  height={50}
                />
              </Link>
            </div>

            {/* Right Side Elements (Search Bar and Cart Icon) */}
            <div className="flex items-center space-x-2">
              <ProductSearchBar />
              <ProductIcon
                icon={<FaShoppingCart size={16} />}
                notificationCount={5}
                bgColor="bg-indigo-500"
                notificationBgColor="bg-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu List */}
        {isOpen && (
          <div className="w-full mt-2 md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {links.map((link) => (
                <div key={link.label} className="relative">
                  {link.hasDropdown ? (
                    <button
                      onClick={toggleDropdown}
                      aria-expanded={isDropdownOpen}
                      aria-controls="mobile-product-dropdown"
                      className="flex items-center text-gray-800 hover:text-customBlue dark:hover:text-white px-3 py-2 rounded-md text-base font-medium uppercase w-full text-left"
                    >
                      {link.label}
                      <BsChevronDown
                        className={`ml-1 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`${
                        activeLink === link.label
                          ? "bg-white text-customBlue font-bold"
                          : "text-gray-800 hover:text-customBlue dark:hover:text-white"
                      } block px-3 py-2 rounded-md text-base font-medium uppercase`}
                      onClick={() => handleLinkClick(link.label)}
                    >
                      {link.label}
                    </Link>
                  )}
                  {isDropdownOpen && link.hasDropdown && (
                    <div
                      id="mobile-product-dropdown"
                      className="absolute left-0 z-10 w-72 mt-2 bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto"
                    >
                      {productLinks.map((product) => (
                        <Link
                          key={product.id} 
                          href={`/products/${product.id}`} 
                          className="block px-4 py-2 text-gray-800 hover:bg-indigo-100 text-md"
                          onClick={() => handleLinkClick(product.name, true)}
                        >
                          {product.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
