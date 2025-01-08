"use client";
import api from "@/services/api";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import loader from '@/src/assests/images/loader.gif';

interface TestimonialProps {
  name: string;
  job: string | null;
  text: string;
  rating: number;
}

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<TestimonialProps[]>([]);

  const fetchTestimonialData = async () => {
    try {
     
      const response = await api.get('/testimonials');
      const formattedData = response.data.map((item: any) => ({
        name: item.name,
        job: item.job,
        text: item.text,
        rating: parseInt(item.rating_summary, 10),
      }));
      setTestimonials(formattedData);
      
    } catch (error) {
      console.error('Failed to load testimonials', error);
    }
  };

  useEffect(() => {
    fetchTestimonialData();
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    // loading testimonials
    return <div className="flex justify-center pt-6"> 
      <Image
        src={loader}
        alt="About Us"
        width={60}
        height={60}
        className="w-[60px] h-[60px] object-cover"
      />
    </div>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full">
        <Testimonial {...testimonials[currentIndex]} />
      </div>
      <div className="flex space-x-2 mt-4">
        {testimonials.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === currentIndex ? "bg-customBlue" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

const Testimonial: React.FC<TestimonialProps> = ({
  name,
  job,
  text,
  rating,
}) => {
  return (
    <div className="flex flex-col items-center p-10 w-full mx-auto bg-gray-100">
      <div className="text-2xl font-bold pb-6">TESTIMONIALS</div>
      <p className="text-center text-gray-700 mb-4">{text}</p>
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-500 mb-2">{job || "No job title provided"}</p>
      <div className="flex mb-2">
        {Array.from({ length: 5 }, (_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < rating ? "text-yellow-500" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 15.27L16.18 19l-1.64-7.03L20 8.24l-7.19-.61L10 2 7.19 7.63 0 8.24l5.46 3.73L3.82 19z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
