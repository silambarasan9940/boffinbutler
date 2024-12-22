"use client";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define an interface for the form data
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  brand: string;
  products: string;
  attachment: string | null; // Updated to hold the base64 string
}

// Define an interface for the errors
interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  message?: string;
  brand?: string;
  products?: string;
  attachment?: string;
  productOrAttachment?: string;
}

interface Brand {
  brand_id: string;
  name: string;
}

const InquireNow: React.FC = () => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const [brands, setBrands] = useState<Brand[]>([]);
  const me = JSON.parse(localStorage.getItem("me") || "{}");

  const [formData, setFormData] = useState<FormData>({
    firstName: me?.firstname || "",
    lastName: me?.lastname || "",
    email: me?.email || "",
    phone: me?.addresses[0]?.telephone || "",
    message: "",
    brand: "",
    products: "",
    attachment: null,
  });

  const [errors, setErrors] = useState<Errors>({});

  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Validation for alphabetic fields
    if ((name === "firstName" || name === "lastName" || name === "message") && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    }

    // Validation for phone field
    if (name === "phone" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target;

    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result as string;

        // Set the base64 image to the corresponding form field
        setFormData((prevData) => ({
          ...prevData,
          [name]: base64Image,
        }));
      };

      // Read the file as base64
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }
    if (!formData.message) newErrors.message = "Message is required.";
    if (!formData.brand) newErrors.brand = "Brand selection is required.";

    // Check if either productList or attachment is provided
    if (!formData.products && !formData.attachment) {
      newErrors.productOrAttachment = "Please provide either a product list or an attachment.";
    }

    return newErrors;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const payload = {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          brand: formData.brand,
          products: formData.products,
          content: formData.attachment
            ? {
                base64_encoded_data: formData.attachment,
              }
            : null,
        },
      };

      try {
        const response = await api.post("/save/enquiry", payload, { headers });
        if(response.status === 200) {
          toast.success(response.data[0].message);
        }
       
        // Clear the form after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          brand: "",
          products: "",
          attachment: null,
        });

        // Clear validation errors
        setErrors({});
      } catch (error:any) {
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred";
        toast.error(errorMessage);
        console.log("Error submitting the form.");
        
      }
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get("/brands", { headers });
      setBrands(response.data);
    } catch (error) {
      console.error("Failed to load brands", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <>
      <Breadcrumbs />

      <div className="w-full sm:max-w-3xl p-6 border rounded-lg mt-8 bg-gray-50 mx-2 md:mx-auto">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Post Your Enquiry</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First Name and Last Name */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex flex-col w-full pb-2 sm:pb-0">
              <label className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`mt-1 p-2 border rounded-lg w-full ${errors.firstName ? "border-red-500" : ""}`}
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>

            <div className="flex flex-col w-full pb-2 sm:pb-0">
              <label className="text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`mt-1 p-2 border rounded-lg w-full ${errors.lastName ? "border-red-500" : ""}`}
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email and Phone */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex flex-col w-full pb-2 sm:pb-0">
              <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 p-2 border rounded-lg w-full ${errors.email ? "border-red-500" : ""}`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="flex flex-col w-full pb-2 sm:pb-0">
              <label className="text-sm font-medium">Phone <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                className={`mt-1 p-2 border rounded-lg w-full ${errors.phone ? "border-red-500" : ""}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </div>

          {/* Message and Brand */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Message <span className="text-red-500">*</span></label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`mt-1 p-2 border rounded-lg w-full ${errors.message ? "border-red-500" : ""}`}
              placeholder="Enter your message"
            />
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Brand <span className="text-red-500">*</span></label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`mt-1 p-2 border rounded-lg w-full ${errors.brand ? "border-red-500" : ""}`}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
          </div>

          {/* Product List */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Product List:</label>
            <input
              type="text"
              name="products"
              value={formData.products}
              onChange={handleChange}
              className={`mt-1 p-2 border rounded-lg w-full ${errors.products ? "border-red-500" : ""}`}
              placeholder="Enter your products"
            />
            {errors.products && <p className="text-red-500 text-sm">{errors.products}</p>}
          </div>

          {/* Attachment */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Attachment (Optional):</label>
            <input
              type="file"
              name="attachment"
              onChange={handleFileChange}
              className="mt-1 p-2 border rounded-lg w-full"
            />
            {errors.productOrAttachment && (
              <p className="text-red-500 text-sm">{errors.productOrAttachment}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg w-full md:w-28"
          >
            Submit
          </button>
        </form>
      </div>

      <ToastContainer />
    </>
  );
};

export default InquireNow;
