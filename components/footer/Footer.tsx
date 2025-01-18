import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoMdCall } from "react-icons/io";
import { FiMail } from "react-icons/fi";
import { FiGlobe } from "react-icons/fi";
import { FaMapLocationDot } from "react-icons/fa6";



const Footer = () => {
  
  return (
    
    <>
    
      <footer className="bg-white dark:bg-gray-800 pt-4 pb-8 xl:pt-8 border-t border-gray-300">
        <div className="max-w-screen-lg px-4 mx-auto text-block-400 xl:max-w-screen-xl sm:px-6 md:px-8 dark:text-gray-300">
          <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-8 text-lg font-light justify-center list-none ps-0">
            {/* First Column */}
            <li className="text-left md:text-left">
              <div className="flex items-center justify-center">
                <Link
                  href="https://boffinbutler.com/"
                  aria-label="BoffinButler Homepage"
                >
                  <Image
                    src="https://media.boffinbutler.com/media/logo/websites/1/BoffinButler_homepage_logo.png"
                    alt="BoffinButler Pvt Ltd"
                    width={200}
                    height={100}
                  />
                </Link>
              </div>
            </li>

            {/* Second Column - Quick Links */}
            <li>
              <div className="text-left md:text-left">
                <h2 className="text-gray-800 dark:text-gray-200 text-md font-medium uppercase mb-4">
                  Quick Links
                </h2>
                <ul className="text-left list-none ps-0">
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="/about-us" aria-label="About Us">
                      About Us
                    </Link>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="#" aria-label="Why Sell with Us">
                      Why Sell with Us?
                    </Link>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="#" aria-label="Why Buy from Us">
                      Why Buy from Us?
                    </Link>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="/faq" aria-label="FAQs">
                      FAQs
                    </Link>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="/contact-us" aria-label="Contact Us">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* Third Column - Policy */}
            <li>
              <div className="text-left md:text-left">
                <h2 className="text-gray-800 dark:text-gray-200 text-md font-medium uppercase mb-4">
                  Policy
                </h2>
                <ul className="text-left list-none ps-0">
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="/terms-and-conditions" aria-label="Terms of Use">
                      Terms of Use
                    </Link>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="/privacy-policy-page" aria-label="Privacy Policy">
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="/terms-of-sale" aria-label="Terms of Sale">
                      Terms of Sale
                    </Link>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="/bf-return-policy" aria-label="Return Policy">
                      Return Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

             {/* fourth Column - My Account */}
             <li>
              <div className="text-left md:text-left">
                <h2 className="text-gray-800 dark:text-gray-200 text-md font-medium uppercase mb-4">
                My Account
                </h2>
                <ul className="text-left list-none ps-0">
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="/customer/account" aria-label="My Account">
                    My Account
                    </Link>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="/customer/account/login" aria-label="Login">
                    Login
                    </Link>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <Link href="/cart" aria-label="My Cart">
                    My Cart
                    </Link>
                  </li>
                 
                </ul>
              </div>
            </li>

            {/* 5th Column - Quick Contact */}
            <li>
              <div className="text-left md:text-left">
                <h2 className="text-gray-800 dark:text-gray-200 text-md font-medium uppercase mb-4">
                  Quick Contact
                </h2>
                <ul className="text-left list-none ps-0">
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <div className="flex items-center justify-start md:justify-start">
                      <IoMdCall />
                      <Link
                        href="tel:+91904371730"
                        aria-label="Call +91-904371730"
                      >
                        <span className="font-normal ps-2">
                          Tel +91-904371730
                        </span>
                      </Link>
                    </div>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <div className="flex items-center justify-start md:justify-start">
                      <FiMail />
                      <Link
                        href="mailto:info@boffinbutler.com"
                        aria-label="Email info@boffinbutler.com"
                      >
                        <span className="font-normal ps-2">
                          info@boffinbutler.com
                        </span>
                      </Link>
                    </div>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                   <div className="flex items-center justify-start md:justify-start">
                   <FiGlobe />
                    <Link
                      href="http://www.boffinbutler.com/"
                      aria-label="Visit www.boffinbutler.com"
                    >
                      <span className="font-normal ps-2">
                        www.boffinbutler.com
                      </span>
                    </Link>
                   </div>
                  </li>
                  <li className="mb-4 transition-colors duration-200 text-sm hover:text-customBlue dark:hover:text-white">
                    <div className="flex justify-start md:justify-start">
                    <FaMapLocationDot />
                    <div className="ps-2 text-left">
                      46 Velappar Nagar, <br />
                      Madhiraveedu, Thiruverkadu, <br />
                      Chennai - 600077
                    </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          <div className="flex flex-col md:flex-row mx-auto items-center justify-center border-t border-gray-200 w-full md:w-11/12 px-4">
            {/* Social Media Links */}
            <div className="pt-4 flex px-4 max-w-xs items-center justify-center md:justify-end">
              {/* Social Media Icons */}
              <Link
                href="#"
                className="mx-4 p-2 rounded-full bg-customBlue hover:bg-indigo-600 transition duration-200"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-black hover:text-white transition duration-200"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="mx-2 p-2 rounded-full bg-customBlue hover:bg-indigo-600 transition duration-200"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-black hover:text-white transition duration-200"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="mx-2 p-2 rounded-full bg-customBlue hover:bg-indigo-600 transition duration-200"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-black hover:text-white transition duration-200"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z"></path>
                </svg>
              </Link>
            </div>

            {/* Newsletter Subscription */}
            {/* <div className="text-center pt-8 sm:pt-12 font-light flex flex-col items-center justify-center md:justify-start w-full">
              <h4 className="text-xl font-semibold text-center py-3">
                SIGN UP FOR OUR NEWSLETTER
              </h4>
              <form className="flex flex-col justify-center w-full max-w-sm space-y-3 md:flex-row md:space-y-0 md:max-w-full">
                <div className="relative rounded-custom w-full md:w-[450px]">
                  <input
                    type="email"
                    id="form-subscribe-email"
                    className="rounded-custom bg-gray-200 border border-customBlue w-full py-2 px-4 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Email"
                  />
                  <button
                    className="rounded-custom absolute top-0 right-0 bottom-0 px-4 py-2 md:mt-0 text-base font-semibold text-white bg-indigo-500 shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="submit"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div> */}
          </div>
        </div>
      </footer>

      {/* Copyright Section */}
      <div className="w-full bg-black text-indigo-100 text-center text-sm py-4">
        Copyright 2024 BoffinButler. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
