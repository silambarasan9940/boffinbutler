"use client";
import React, { useEffect, useState } from 'react';
import SidebarNavigation from '@/components/myaccount/page';
import Link from 'next/link';
import api from '@/services/api';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { CustomerResponse } from '@/services/types/address-types';
import MyOrder from '@/components/my-order/myorder';


const AccountPage = () => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const [customerData, setCustomerData] = useState<CustomerResponse | null>(null);

  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  const fetchAddressData = async () => {
    try {
      const response = await api.get<CustomerResponse>('/customers/me', { headers });
      setCustomerData(response.data);
      
    } catch (error) {
      console.log('Failed to Fetch data', error);
    }
  };

  useEffect(() => {
    fetchAddressData();
  }, []);

  return (
    <div className='w-11/12 mx-auto pt-10'>
      <div className='flex flex-col md:flex-row'>
        <div className='w-full md:w-3/12'>
          <SidebarNavigation />
        </div>
        <div className='w-full md:w-9/12'>
          <div className='text-2xl font-bold py-4 text-center'>
            My Account
          </div>
          <div className='d-block'>
            <div className='text-2xl font-bold py-4 border-b border-gray-300'>
              Account Information
            </div>
            <div className='text-md font-semibold pt-3 pb-2'>Contact Information</div>
            <div className='text-sm pb-2'>{customerData?.firstname} {customerData?.lastname}</div>
            <div className='text-sm'>{customerData?.email}</div>
          </div>

          <div className='d-block'>
            <div className='text-2xl font-bold py-4 border-b border-gray-300'>
              Address Book
            </div>
            <div className='flex flex-row items-center justify-between py-3'>
              {customerData?.addresses.map((address, index) => (
                <div key={index} className='w-full md:w-1/2'>
                  <div className='text-md font-semibold pb-2'>
                  Billing Address
                   
                  </div>
                  <div className='text-sm pb-2'>{address.firstname} {address.lastname}</div>
                  <div className='text-sm pb-2'>{address.company}</div>
                  <div className='text-sm pb-2'>{address.street.join(', ')}</div>
                  <div className='text-sm pb-2'>{address.city}</div>
                  <div className='text-sm pb-2'>{address.region.region}</div>
                  <div className='text-sm pb-2'> {address.postcode}</div>
                  <div className='text-sm'>{address.country_id}</div>
                </div>
              ))}
              {customerData?.addresses.map((address, index) => (
                <div key={index} className='w-full md:w-1/2'>
                  <div className='text-md font-semibold pb-2'>
                  Shipping Address
                   
                  </div>
                  <div className='text-sm pb-2'>{address.firstname} {address.lastname}</div>
                  <div className='text-sm pb-2'>{address.company}</div>
                  <div className='text-sm pb-2'>{address.street.join(', ')}</div>
                  <div className='text-sm pb-2'>{address.city}</div>
                  <div className='text-sm pb-2'>{address.region.region}</div>
                  <div className='text-sm pb-2'> {address.postcode}</div>
                  <div className='text-sm'>{address.country_id}</div>
                </div>
              ))}
            </div>
          </div>

          <div className='text-2xl font-bold py-4 border-b border-gray-300'>
            Recent Orders <span className='text-indigo-500 text-sm'><Link href="/sales/order/history">View All</Link></span>
            
          </div>
          <>
          <MyOrder hideOrdersHeading={false} hideOrderItemShowing={false} />
          </>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
