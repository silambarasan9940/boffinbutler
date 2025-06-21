"use client";
import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { imageUrl } from "@/services/common/index";
import dynamic from "next/dynamic";
import api from "@/services/api";

// Dynamically import components for suspense handling
const CreateNewEmployerAccount = dynamic(
  () => import("@/components/create-signup/createnewemployeraccount")
);
const PurchaseDepartment = dynamic(
  () => import("@/components/create-signup/purchasedepartment")
);
const Faculty = dynamic(() => import("@/components/create-signup/facluty"));
const Student = dynamic(() => import("@/components/create-signup/student"));

// AccountTypeRenderer component
const AccountTypeRenderer = ({
  type,
  cities,
  states,
  departments,
  institutes,
}: {
  type: string;
  cities: any;
  states: any;
  departments: any;
  institutes: any;
}) => {
  if (type === "2") {
    return <CreateNewEmployerAccount cities={cities} states={states} />;
  } else if (type === "3") {
    return (
      <Faculty
        cities={cities}
        states={states}
        departments={departments}
        institutes={institutes}
      />
    );
  } else if (type === "4") {
    return (
      <PurchaseDepartment
        cities={cities}
        states={states}
        departments={departments}
        institutes={institutes}
      />
    );
  } else if (type === "5") {
    return (
      <Student
        cities={cities}
        states={states}
        departments={departments}
        institutes={institutes}
      />
    );
  } else {
    return null;
  }
};

const CreateAccount = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") ?? "";

  const [showOrganizationDropdown, setShowOrganizationDropdown] =
    useState(false);
  const [selectedOrganizationType, setSelectedOrganizationType] = useState("");
  const [States, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [departments, setDepartments] = useState([]);

  const handleBuyerClick = () => {
    setShowOrganizationDropdown(true);
  };

  const handleOrganizationSelect = (event: any) => {
    const selectedType = event.target.value;
    setSelectedOrganizationType(selectedType);

    if (selectedType === "corporate") {
      router.push("/customer/account/create/?type=2");
    }
  };

  const handleDepartmentSelect = (event: any) => {
    const department = event.target.value;
    let newType;

    if (department === "faculty") {
      newType = "3";
    } else if (department === "purchase") {
      newType = "4";
    } else if (department === "student") {
      newType = "5";
    } else {
      return;
    }

    router.push(`/customer/account/create/?type=${newType}`);
  };

  // Api call for cities
  useEffect(() => {
    fetchCities();
    fetchState();
    fetchInstitutes();
  }, []);

  const fetchState = async () => {
    try {
      const response = await api.get("/storeconfig/0");
      setStates(response.data[0].store[0].region.IN);
    } catch (error) {
      console.log("failed sates listing", error);
    }
  };
  const fetchCities = async () => {
    try {
      const response = await api.get("/region/cities");
      setCities(response.data);
    } catch (error) {
      console.log("Failed to fetch cities details");
    }
  };
  const fetchInstitutes = async () => {
    try {
      const response = await api.get("/register/config");
      setInstitutes(response.data[0].institute);
      setDepartments(response.data[0].department);
      console.log(response.data[0]);
    } catch (error) {
      console.log("Failed to fetch cities details");
    }
  };

  return (
    <div className="w-11/12 mx-auto">
      {type ? (
        <AccountTypeRenderer
          type={type}
          cities={cities}
          states={States}
          departments={departments}
          institutes={institutes}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-80">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 mt-14 md:mt-0">
            CREATE ACCOUNT
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 w-full gap-4">
            <div className="bg-gray-50 shadow-md rounded-lg p-4 md:p-6 w-full md:w-1/2">
              <div className="flex flex-col items-center">
                <img
                  src={`${imageUrl}wysiwyg/buyer-icon-clipart.png`}
                  alt="Buyer Icon"
                  className="w-12 h-12 md:w-16 md:h-16 mb-4"
                />

                <button
                  className="bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600 w-full md:w-auto"
                  onClick={handleBuyerClick}
                >
                  Buyer
                </button>

                {showOrganizationDropdown && (
                  <div className="mt-4 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0">
                    <label className="block mb-2 md:pe-2">
                      Organization Type:
                    </label>
                    <select
                      value={selectedOrganizationType}
                      onChange={handleOrganizationSelect}
                      className="border rounded-lg p-2 w-full md:w-auto"
                    >
                      <option value="">--Select--</option>
                      <option value="corporate">Corporate</option>
                      <option value="institute">Institute</option>
                    </select>
                  </div>
                )}

                {selectedOrganizationType === "institute" && (
                  <div className="mt-4 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0">
                    <label className="block mb-2 md:pe-2">Register As:</label>
                    <select
                      onChange={handleDepartmentSelect}
                      className="border rounded-lg p-2 w-full md:w-auto"
                    >
                      <option value="">--Select--</option>
                      <option value="faculty">Faculty</option>
                      <option value="purchase">Purchase Department</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 shadow-md rounded-lg p-4 md:p-6 w-full md:w-1/2">
              <div className="flex flex-col items-center">
                <img
                  src={`${imageUrl}wysiwyg/seller-icon-clipart.png`}
                  alt="Seller Icon"
                  className="w-12 h-12 md:w-16 md:h-16 mb-4"
                />

                <button className="bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600 w-full md:w-auto">
                  Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

//export default CreateAccount;

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAccount />
    </Suspense>
  );
}
