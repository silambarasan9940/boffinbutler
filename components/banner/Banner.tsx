"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import api from "@/services/api/index"; 
import { imageUrl } from "@/services/common/index"; 
import Link from "next/link"; 

type BannerImage = {
  image: string; 
  bannerImageUrl: string; 
  url_banner: string; 
  name: string;
};


const Banner = () => {

  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]); 

  useEffect(() => {
    const bannerFetchImage = async () => {
      try {
       
        const responseImage = await api.get('/bannersliderblocks/1');
        const data = responseImage.data;
       
        const bannerData = Array.isArray(data)
          ? data.map((item: any) => ({
              image: item.image, 
              bannerImageUrl: `${imageUrl}mageplaza/bannerslider/banner/image/${item.image}`, 
              url_banner: item.url_banner || '', 
              name: item.name
            }))
          : [];
        setBannerImages(bannerData || []); 
        
      } catch (error) {
        console.error("Error fetching banner images:", error);
      }
    };

    bannerFetchImage();
  }, []);

  return (
    <div>
      <Carousel
        additionalTransfrom={0}
        autoPlaySpeed={1000}
        autoPlay
        arrows={false}
        centerMode={false}
        dotListClass="pb-8"
        draggable
        focusOnSelect={false}
        infinite
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
          },
          tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        slidesToSlide={1}
        swipeable
      >
        {bannerImages.length > 0 ? (
          bannerImages.map((image, index) => (
            image.bannerImageUrl ? (
              <Link href={image.url_banner || '#'} key={index}> 
                <div className="relative w-full h-[300px] sm:h-[500px]"> 
                  <Image
                    src={image.bannerImageUrl} 
                    alt={image.name || `Slide ${index + 1}`}
                    fill
                    className="object-cover w-full h-full" 
                    priority
                  />
                </div>
              </Link>
            ) : null 
          ))
        ) : (
          <div className="relative h-[500px] flex items-center justify-center">
            <p>Loading...</p>
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default Banner;
