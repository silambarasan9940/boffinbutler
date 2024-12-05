"use client";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import WithStyles from "@/components/laboratory-requirements/LaboratoryRequirementsCard";
import api from "@/services/api";
import { imageUrl } from "@/services/common";


interface Products {
  image: string;
  name:string;
}


const LaboratoryRequirements = () => {

  const [products, setProducts] = useState<Products[]>([]);

const fetchsliderData = async () => {
  
  try {
    
    const response = await api.get('/productblocks/1');
    setProducts(response.data[0].items);
    
  } catch (error) {
    console.log('Failed to laod data', error)
  }
}

useEffect(()=>{
  fetchsliderData();
},[])
  return (
    <div>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode
        className=""
        containerClass="container"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          mobile: {
            breakpoint: {
              max: 540,
              min: 0,
            },
            items: 1,
            partialVisibilityGutter: 30,
          },
          tablet: {
            breakpoint: {
              max: 768,
              min: 541,
            },
            items: 2,
            partialVisibilityGutter: 30,
          },
          medium: {
            breakpoint: {
              max: 1024,
              min: 769,
            },
            items: 3,
            partialVisibilityGutter: 30,
          },
          dektop: {
            breakpoint: {
              max: 3000,
              min: 1025,
            },
            items: 4,
            partialVisibilityGutter: 30,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {products.map((item,index) => 
          <WithStyles key={index}
          title={item.name}
          imageurl={`${imageUrl}catalog/product${item.image}`}
        />
        )
          
        }
      </Carousel>
    </div>
  );
};

export default LaboratoryRequirements;
