"use client";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

interface CustomerResponse {
  firstName: string;
  lastName: string;
  customAttributes: Record<string, string>;
  extension_attributes: Record<string, string>;
}

const EditAccountInformation = () => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);

  const [customerData, setCustomerData] = useState<CustomerResponse | null>(
    null
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  const fetchAddressData = async () => {
    try {
      const response = await api.get("/customers/me", { headers });
      const data = response.data;

      setCustomerData({
        firstName: data.firstname,
        lastName: data.lastname,
        customAttributes: data.custom_attributes.reduce(
          (
            acc: Record<string, string>,
            attr: { attribute_code: string; value: string }
          ) => {
            acc[attr.attribute_code] = attr.value;
            return acc;
          },
          {}
        ),
        extension_attributes: data.extension_attributes || {},
      });

      setFirstName(data.firstname);
      setLastName(data.lastname);
    } catch (error) {
      console.log("Failed to fetch data", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        "/customers",
        { firstName, lastName },
        { headers }
      );
      fetchAddressData();
      console.log(response, "updated");
    } catch (error) {
      console.log("Failed to update data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddressData();
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Account Information</h2>

      {/* Account Information Section */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-xl font-semibold mb-4">Account Information</h3>

        <div className="mb-4">
          <label className="block font-medium mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Additional Information Section - Display Only */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-xl font-semibold mb-4">Additional Information</h3>

        <div className="mb-4">
          <label className="block font-medium mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div>{customerData?.customAttributes.mobilenumber || "N/A"}</div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Institute</label>
          <div>
            {customerData?.extension_attributes.department_label || "N/A"}
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Department</label>
          <div>
            {customerData?.extension_attributes.institute_label || "N/A"}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default EditAccountInformation;
