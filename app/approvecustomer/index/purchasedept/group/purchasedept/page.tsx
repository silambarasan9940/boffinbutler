"use client";
import React from "react";
import SidebarNavigation from "@/components/myaccount/page";
import PurchaseDeptListing from "@/components/purchasedeptlist/page";

const PurchaseDeptListPage = () => {
  return (
    <div className="w-11/12 mx-auto pt-10">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-3/12">
          <SidebarNavigation />
        </div>
        <div className="w-full md:w-9/12">
          <PurchaseDeptListing />
        </div>
      </div>
    </div>
  );
};

export default PurchaseDeptListPage;
