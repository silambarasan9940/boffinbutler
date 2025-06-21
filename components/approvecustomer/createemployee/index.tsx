"use client";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EmployeeData {
  id: string;
  faculty_type: number;
  firstname: string;
  lastname: string;
  email: string;
  mobilenumber: string;
  group: number;
  name: string;
  designation?: string;
  role_dept?: string;
  faculty?: string;
  id_card_number?: string;
  approver_id?: string[];
  approver_amount?: string[];
}
interface Approver {
  id: number;
  sort_key: string;
  priority: string;
  name: string;
  email: string;
}
interface CreateEmployeeDataFormProps {
  EmployeeData: EmployeeData;
  showtitle: boolean;
  onClose: () => void;
}

const CreateEmployeeForm: React.FC<CreateEmployeeDataFormProps> = ({
  EmployeeData,
}) => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    designation: "",
    department: "",
    group: "",
  });

  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [selectedApprovers, setSelectedApprovers] = useState<
    { id: any; amount: any }[]
  >([]);
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };
  const fetchApprovers = async () => {
    try {
      const response = await api.get("/employer/manager/list", { headers });
      setApprovers(response.data);
      console.log("Approver list", response.data);
    } catch (error) {
      console.log("Failed to load data list");
    }
  };
  useEffect(() => {
    fetchApprovers();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Validation for each field
    if (name === "mobile" && !/^\d*$/.test(value)) {
      return;
    } else if (
      ["firstName", "lastName", "designation", "department"].includes(name) &&
      !/^[a-zA-Z\s]*$/.test(value)
    ) {
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log("form data", formData);
  };

  const handleApproverChange = (
    index: number,
    field: "id" | "amount",
    value: string
  ) => {
    setSelectedApprovers((prevApprovers) =>
      prevApprovers.map((approver, idx) =>
        idx === index ? { ...approver, [field]: value } : approver
      )
    );
  };

  const addApprover = () => {
    if (selectedApprovers.length < 6) {
      setSelectedApprovers([...selectedApprovers, { id: "", amount: "" }]);
    } else {
      toast.error("You can add a maximum of 6 approvers.");
    }
  };

  const deleteApprover = (index: number) => {
    setSelectedApprovers((prevApprovers) =>
      prevApprovers.filter((_, idx) => idx !== index)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let entity_id = "";

    if (!EmployeeData || !EmployeeData.id) {
    } else {
      entity_id = EmployeeData.id;
    }
    const payload = {
      data: {
        entity_id: entity_id,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        mobilenumber: formData.mobile,
        designation: formData.designation,
        role_dept: formData.department,
        approver_id: selectedApprovers
          .filter((approver) => approver !== undefined)
          .map((approver) => approver.id),
        approver_amount: selectedApprovers
          .filter((approver) => approver !== undefined)
          .map((approver) => approver.amount),
        group: formData.group || null,
      },
    };

    try {
      const response = await api.post("/create/employee", payload, { headers });
      console.log("employee payload sent", response.data);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        designation: "",
        department: "",
        group: "",
      });
      setApprovers([]);
      toast.success("Form updated successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Create Employee
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700"
          >
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
            maxLength={10}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="designation"
            className="block text-sm font-medium text-gray-700"
          >
            Designation
          </label>
          <input
            type="text"
            name="designation"
            id="designation"
            value={formData.designation}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <input
            type="text"
            name="department"
            id="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mt-6">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Employee Type
          </label>
          <select
            className="w-full mt-1 p-2 bg-white border border-gray-300 text-gray-700 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="group"
            value={formData.group}
            onChange={handleChange}
          >
            <option value="">Employee</option>
            <option value="pd">Purchase Dept</option>
            <option value="manager">Approver/Manager</option>
          </select>
        </div>

        {/* Approvers */}
        {formData.group === "" && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Approvers</h3>
            {selectedApprovers.map((approver, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-medium">
                  Approver {index + 1}
                </label>
                <select
                  // value={approver.id}
                  onChange={(e) =>
                    handleApproverChange(index, "id", e.target.value)
                  }
                  className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Approver</option>
                  {approvers.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={selectedApprovers[index]?.amount}
                  onChange={(e) =>
                    handleApproverChange(index, "amount", e.target.value)
                  }
                  className="p-2 border rounded-md shadow-sm w-20 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Amount"
                />
                <button
                  type="button"
                  onClick={() => deleteApprover(index)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addApprover}
              className="text-indigo-600 hover:underline"
            >
              Add Approver
            </button>
          </div>
        )}
        <div className="mt-5">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-indigo-500 text-white hover:bg-indigo-600 rounded-md shadow-sm"
          >
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateEmployeeForm;
