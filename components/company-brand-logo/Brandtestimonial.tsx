"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import api from '@/services/api';
import { imageUrl } from '@/services/common';
import { useRouter } from 'next/navigation';

interface Testimonial {
  brand_id: string;
  image: string;
  name:string;
  url_key: string;
}

const itemsToShow = 6;

const groupTestimonials = (testimonials: Testimonial[], itemsPerGroup: number) => {
  const groups: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += itemsPerGroup) {
    groups.push(testimonials.slice(i, i + itemsPerGroup));
  }
  return groups;
};

const Brandtestimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [brands, setBrands] =useState([]);
  const totalTestimonials = brands.length;
  const totalSlides = Math.ceil(totalTestimonials / itemsToShow);
  const groupedTestimonials = groupTestimonials(brands, itemsToShow);
  const router = useRouter();
  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
      setBrands(response.data);
    } catch (error) {
      console.log('failed to laoding brands', error)
    }
  }

  useEffect(() => {
    const interval = isHovered ? null : setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 3000);
    fetchBrands();
    return () => {
      if (interval) clearInterval(interval);
    };
    
  }, [isHovered, totalSlides]);
  
  const handleImageClick = (brand_id:string) => {
    router.push(`/products?brand=${brand_id}`)
  }

  return (
    <div
      className="w-full py-8 bg-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Company Header */}
      <div className="flex justify-center mb-4">
        <h3 className="text-xl font-semibold">We work with the best brands in the market</h3>
      </div>

      {/* Testimonial Slider */}
      <div className="relative max-w-7xl mx-auto overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(currentIndex * 100)}%)` }} 
        >
          {groupedTestimonials.map((item, Index) => (
            <div
              key={Index}
              className="flex min-w-full"
            >
              {item.map((brands) => (
                <div
                  key={brands.brand_id}
                  className="flex justify-center items-center p-4 min-w-full md:min-w-[16.66%]"
                >
                  <Image
                    src={`${imageUrl}${brands.image}`}
                    alt={brands.name}
                    className="rounded-xl mb-4 w-full h-auto object-cover cursor-pointer"
                    width={150}
                    height={150}
                    onClick={()=>handleImageClick(brands.brand_id)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 mt-4">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-customBlue' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brandtestimonial;
