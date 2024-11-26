"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaRegSquare } from "react-icons/fa6";
import BestSeller from "@/components/bestseller/BestSeller";
import Brandtestimonial from "@/components/company-brand-logo/Brandtestimonial";
import Tabs from "@/components/tab/Tabs";
import Testimonial from "@/components/testimonial/Testimonial";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import leftimg from '@/src/assests/images/leftimg.png';
import rightimg from '@/src/assests/images/rightimg.png';
import icon1 from '@/src/assests/images/icon1.png';
import icon2 from '@/src/assests/images/icon2.png';
import Link from "next/link";

interface Tab {
  title: string;
  content: string;
}

const AboutUs = () => {
  // State to track the active tab and content visibility
  const [activeTab, setActiveTab] = useState(0);
  const [showFullContent, setShowFullContent] = useState<boolean[]>([]);

  // Sample tab data
  const tabs: Tab[] = [
    {
      title: "Company",
      content:
        "The meaning of production in Carlio is the creation, development, and the path to progress, and the starting point to achieve the goals that we all have the Petroforce brand, with over 20 years of experience in the oil and petrochemical industry, we officially started our activities in the field of design, engineering, construction of refinery equipment, and the production of various motor and industrial lubricants in the year 1390 (2011). This is a sample content to show five lines of content.",
    },
    {
      title: "Products",
      content:
        "Our product line includes a variety of motor and industrial lubricants designed to perform in harsh conditions and deliver exceptional results. With an emphasis on sustainability and innovation, we strive to produce products that contribute to the industry's growth and development. Our commitment to quality and excellence ensures that our products meet international standards and provide reliable performance.",
    },
    {
      title: "Our Team",
      content:
        "We have a team of experts dedicated to research and development, ensuring that every product we create is of the highest quality. With a focus on collaboration and excellence, our team works tirelessly to meet the needs of our customers and deliver value at every step. Join us in this journey as we continue to innovate and lead the industry with our world-class products and services.",
    },
  ];

  // Initialize the showFullContent state with the length of the tabs array
  useEffect(() => {
    setShowFullContent(new Array(tabs.length).fill(false));
  }, [tabs.length]);

  // Function to handle "Learn More" button click
  const handleLearnMore = (index: number) => {
    setShowFullContent((prev) => {
      const updatedState = [...prev];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  };

  // Function to handle tab click
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setShowFullContent(new Array(tabs.length).fill(false)); 
  };

  return (
    <>
        <div className="w-11/12 bg-white mx-auto">
          <Breadcrumbs />
          {/* Section 1: Image and Tabs */}
          <div className="flex flex-wrap items-start py-10">
            {/* Left side: Image Section */}
            <div className="w-full md:w-3/5 mb-6 md:mb-0">
              <Image
                src={leftimg}
                alt="About Us"
                width={600}
                height={600}
                className="w-full h-[450px] object-cover"
              />
            </div>

            {/* Right side: Content Section */}
            <div className="w-full md:w-2/5 md:pl-10 space-y-4">
              {/* Rotating Icon and Text */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-500 flex items-center justify-center rounded-sm mr-4">
                  <span className="transform rotate-45 text-indigo-500">
                    <FaRegSquare />
                  </span>
                </div>
                <p className="text-sm uppercase text-gray-500">About Us</p>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Our Company Overview
              </h2>
              {/* Paragraph Section */}
              <p className="text-gray-600">
                Carlio brand is one of the most reliable motor oil
                manufacturers, which is engaged in the production of high
                quality products with a history of more than decades in the
                industry.
              </p>

              {/* Tabs Section */}
              <div>
                <div className="flex justify-between space-x-4 border-b border-gray-200">
                  {tabs.map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => handleTabClick(index)}
                      className={`py-2 px-4 mb-4 transition ${
                        activeTab === index
                          ? "bg-indigo-500 text-white rounded-sm"
                          : "border-transparent text-gray-600"
                      }`}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>

                {/* Active Tab Content */}
                <div className="mt-4">
                  <p className="text-gray-700">
                    {showFullContent[activeTab]
                      ? tabs[activeTab].content
                      : `${tabs[activeTab].content.slice(0, 300)}...`}{" "}
                  </p>
                  <button
                    onClick={() => handleLearnMore(activeTab)}
                    className={`mt-2 rounded-md px-4 py-2 ${
                      showFullContent[activeTab]
                        ? "bg-indigo-500 text-white" 
                        : "bg-black text-white" 
                    }`}
                  >
                    {showFullContent[activeTab] ? "Show Less" : "Learn More"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      {/* Section 2: Full Width Background Section */}
      <div className="w-full py-16 bg-customBlue">
        <div className="w-11/12 flex flex-col md:flex-row mx-auto">
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl font-bold text-left mb-6 text-yellow-500">
              ~ WHO WE ARE
            </h3>
            <h2 className="text-4xl font-bold text-left text-white mb-6">
              We Help To Get Solutions
            </h2>
            <p className="text-left text-white mb-12">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s,
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* First Subsection */}
              <div className="flex flex-col md:flex-row items-center w-full">
                {/* Left Image */}
                <div className="w-[100px] mb-6 md:mb-0">
                  <Image
                    src={icon1}
                    alt="icon1"
                    width={100}
                    height={100}
                    className="h-[auto] object-cover"
                  />
                </div>
                {/* Right Content */}
                <div className="w-full md:pl-8 space-y-4">
                  <h3 className="text-xl font-semibold text-white">
                    Lorem Ipsum
                  </h3>
                  <p className="text-white">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                </div>
              </div>

              {/* Second Subsection */}
              <div className="flex flex-col md:flex-row items-center">
                {/* Left Image */}
                <div className="w-[100px] mb-6 md:mb-0">
                <Image
                    src={icon2}
                    alt="icon2"
                    width={100}
                    height={100}
                    className="h-[auto] object-cover"
                  />
                </div>
                {/* Right Content */}
                <div className="w-full md:pl-8 space-y-4">
                  <h3 className="text-xl font-semibold text-white">
                    Lorem Ipsum
                  </h3>
                  <p className="text-white">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                </div>
              </div>
            </div>
            {/* Contact Us Button */}
            <div className="text-left mt-12">
             <Link href="/contact-us">
             <button className="px-8 py-3 bg-yellow-500 text-black text-2xl rounded-full hover:bg-yellow-600 transition">
                Contact Us
              </button>
             </Link>
            </div>
          </div>

          {/* Right Side Big Image */}
          <div className="w-full mx-auto md:w-1/2 mt-16">
            <Image
              src={rightimg}
              alt="Image"
              width={600}
              height={450}
              className="w-full h-[400px] object-cover rounded-lg md:mx-6"
            />
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="w-full py-8">
          <div className="pt-8 text-center w-11/12 mx-auto border-b-2 border-gray-300">
            <BestSeller />
          </div>
        </div>
        <div className="flex flex-1 justify-center py-[40px] w-full bg-gray-100">
          <div className="text-center w-11/12">
            <Brandtestimonial />
          </div>
        </div>
        <div className="w-full py-6">
          <div className="pt-8 text-center w-11/12 mx-auto">
            <Tabs />
          </div>
        </div>
        <div className="flex flex-1 justify-center pb-8 w-full bg-gray-100">
          <div className="text-center w-11/12">
            <Testimonial />
          </div>
        </div>
    </>
  );
};

export default AboutUs;
