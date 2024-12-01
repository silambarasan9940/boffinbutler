"use client";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

interface FacultyData {
  id: string;
  faculty_type: number;
  firstname: string;
  lastname: string;
  email: string;
  mobilenumber: string;
  group: number;
  name: string;
}

interface CreateFacultyDataFormProps {
  facultyData: FacultyData;
  showtitle: boolean;
  onClose: () => void; 
}

const CreateFacultyForm: React.FC<CreateFacultyDataFormProps> = ({ facultyData,showtitle = true, onClose }) => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
  });

  // Initialize formData with studentData when component mounts or studentData changes
  useEffect(() => {
    if (facultyData) {
      setFormData({
        firstName: facultyData.name.split(" ")[0],
        lastName: facultyData.name.split(" ")[1],
        email: facultyData.email,
        mobile: facultyData.mobilenumber,
      });
    }
  }, [facultyData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const headers = {
      Authorization: `Bearer ${tokenApi}`,
      "Content-Type": "application/json",
    };

    const payload = {
      data: {
        // entity_id: facultyData.id || null,
        faculty_type: 2,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        mobilenumber: formData.mobile,
        group_id: 2,
      },
    };

    try {
      const response = await api.post('/create/faculty', payload, { headers });
      console.log('create faculty', formData)
      setFormData({ firstName: '', lastName: '', email: '', mobile: '' });
      toast.success('Form updated successfully');
      onClose();
      
    } catch (error) {
      // toast.error('Error updated submitting');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {showtitle && <h2 className="text-2xl font-semibold text-center mb-6">Create Faculty</h2>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
            Mobile
          </label>
          <input
            type="tel"
            name="mobile"
            id="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
        {/* Toast Container */}
      <ToastContainer />
      </form>
    </div>
  );
};

export default CreateFacultyForm;
