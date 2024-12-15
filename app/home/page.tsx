import React from 'react';
import Banner from '@/components/banner/Banner';
import BestSeller from '@/components/bestseller/BestSeller';
import Brandtestimonial from '@/components/company-brand-logo/Brandtestimonial';
import LaboratoryRequirements from '@/components/laboratory-requirements/LaboratoryRequirements';
import ProductList from '@/components/newly-added-products/ProductList';
import Tabs from '@/components/tab/Tabs';
import Testimonial from '@/components/testimonial/Testimonial';

const Home = () => {
  return (
    <>
    
      <div className="w-full">
          <Banner />
        </div>
        <div className="w-full bg-indigo-500 py-6">
          <LaboratoryRequirements />
        </div>
        <div className="w-full py-8">
          <div className="pt-8 text-center w-11/12 mx-auto border-b-2 border-gray-300">
            <BestSeller />
          </div>
        </div>
        <div className="w-fll bg-white py-8">
          <div className="w-11/12 mx-auto">
            <ProductList />
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
  )
}

export default Home;
;