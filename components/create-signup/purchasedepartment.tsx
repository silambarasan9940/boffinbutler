"use client";
import api from "@/services/api";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpModal from "../otp/otp";
import { useRouter } from 'next/navigation';

const PurchaseDepartment = ({ cities, states, departments, institutes }: { cities: any; states:any; departments:any; institutes:any; }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    telephone: "",
    profileurl: "",
    inchargeidcard:{base64:"",fileType: "",fileName: ""},
    termsCondition: false,
    street: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    institute: "",
    department: "",
    other_institute: "",
    other_department: "",
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const sendOtp = async () => {
    if (!formData.telephone) {
      setFormErrors({ telephone: "Mobile Number is required to send OTP" });
      return;
    }

    try {
      const response = await api.post("/generate/otp", {
        telephone: formData.telephone,
      });
      // if (response.status === 200) {
      toast.success("OTP sent to mobile number");
      setIsOtpSent(true);
      setShowOtpModal(true);

      // } else {
      //   toast.error("Failed to send OTP");
      // }
    } catch (error) {
      toast.error("Error sending OTP");
      console.error("Error sending OTP:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked, files } = e.target;

    // Image file handling (convert to base64)
    if (type === "file" && files && files[0]) {
      const file = files[0];
       // Extract file name and file type
  const fileName = file.name; // Original file name
  const fileType = file.type; // MIME type (e.g., image/png)

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result as string;

        // Set the base64 image to the corresponding form field
        setFormData((prevData) => ({
          ...prevData,
          [name]: {
            base64: base64Image,
            fileName,
            fileType,
          },
        }));
      };

      // Read the file as base64
      reader.readAsDataURL(file);
    } else if (name === "telephone" || name === "postalCode") {
      // Validation for numbers only (telephone, postalCode)
      const numericValue = value.replace(/\D/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    } else if (
      name === "firstname" ||
      name === "lastname" 
    ) {
      // Validation for characters only (firstname, lastname)
      const alphaValue = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: alphaValue,
      }));
    } else {
      // For other fields (including file inputs and URL)
      setFormData((prevData) => ({
        ...prevData,
        [name]:
          type === "checkbox" ? checked : type === "file" ? files?.[0] : value,
      }));
    }
  };

  const validateForm = () => {
    let errors: any = {};
    if (!formData.firstname) errors.firstname = "First Name is required";
    if (!formData.lastname) errors.lastname = "Last Name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (formData.password !== formData.passwordConfirmation) {
      errors.passwordConfirmation = "Passwords do not match";
    }
    if (!formData.telephone)
      errors.telephone = "Mobile Number is required";
    if (!formData.termsCondition)
      errors.termsCondition = "You must accept the Terms & Conditions";

    if(!formData.street) errors.street = "You have to add Register address";
    if (!formData.country) errors.country = "Please select country";
    if (!formData.state) errors.state = "Please select state";
    if (!formData.city) errors.city = "Please add city";
    if (!formData.postalCode) errors.postalCode = "Please add postal code";
    if (!formData.institute) errors.institute = "Please select institute";
    if ((formData.institute === '230' || formData.institute === 'others') && !formData.other_institute) errors.other_institute = "Please select institute";
    if (!formData.department) errors.department = "Please select department";
    if ((formData.department === '220' || formData.department === 'others') && !formData.other_department) errors.other_department = "Please select department";
    return errors;
  };

  const fetchSubmitForm = async () => {
    try {
      const requestPayload = {
        customer: {
          email: formData.email,
          firstname: formData.firstname,
          lastname: formData.lastname,
          addresses: [
            {
              defaultShipping: true,
              defaultBilling: true,
              firstname: formData.firstname,
              lastname: formData.lastname,
              region: {
                region: formData.state,
                regionCode: "TN",
                regionId: 599,
              },
              postcode: formData.postalCode,
              street: [formData.street],
              city: formData.city,
              telephone: formData.telephone,
              countryId: formData.country,
            },
          ],
          customAttributes: [
            {
              attributeCode: "mobilenumber",
              value: formData.telephone,
            },
            {
              attributeCode: "mobilenumber_code",
              value: "91",
            },
            {
              attributeCode: "terms_condition",
              value: formData.termsCondition ? "1" : "0",
            },
            {
              attributeCode: "user_type",
              value: "5",
            },
            {
              attributeCode: "group_id",
              value: "1",
            },
            {
              attributeCode: "institute",
              value: formData.institute === 'others' ? '230' : formData.institute
          },
          {
            attributeCode: "other_institute",
            value: formData.other_institute
        },
          {
              attributeCode: "department",
              value: formData.department === 'others' ? '220' : formData.department
          },
          {
            attributeCode: "other_department",
            value: formData.other_department
        },
        {
          attributeCode: "incharge_idcard",
          value: {
            base64_encoded_data:formData.inchargeidcard.base64.split(",")[1],
            type:formData.inchargeidcard.fileType,
            name:(Date.now() * 1000).toString()+'.'+formData.inchargeidcard.fileName.split(".")[1]

          }, 
        },
          ],
        },
        password: formData.password,
      };

      const response = await api.post('/customers', requestPayload);
      if (response.status === 200) {
        toast.success("Account successfully Sign Up");
        // Reset form fields after successful submission
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        telephone: "",
        profileurl: "",
        inchargeidcard:{base64:"",fileType: "",fileName: ""},
        termsCondition: false,
        street: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
        institute: "",
        department: "",
        other_institute: "",
        other_department: "",
      });
      router.push('/customer/account/login');
      }
    } catch (error) {
      toast.error("Error creating account Sign Up");
      console.error("Error creating account:", error);
    }
  }
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      sendOtp();
      console.log('response failed', formData)
    } else {
      setFormErrors(errors);
      console.log('response failed', errors)
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg mt-14">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-3">
      Create New Purchase Department
      </h2>
      <Link href="/customer/account/create" className="text-indigo-500 py-3">
        Change Form
      </Link>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3"
      >
        {/* Left Column - Personal Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-3 text-indigo-500">
            Personal Information
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className={`mt-1 p-2 w-full border ${
                  formErrors.firstname ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
                value={formData.firstname}
                onChange={handleInputChange}
              />
              {formErrors.firstname && (
                <p className="text-red-500 text-sm">{formErrors.firstname}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastname" className="block text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                className={`mt-1 p-2 w-full border ${
                  formErrors.lastname ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
                value={formData.lastname}
                onChange={handleInputChange}
              />
              {formErrors.lastname && (
                <p className="text-red-500 text-sm">{formErrors.lastname}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`mt-1 p-2 w-full border ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`mt-1 p-2 w-full border ${
                  formErrors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
                value={formData.password}
                onChange={handleInputChange}
              />
              {formErrors.password && (
                <p className="text-red-500 text-sm">{formErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium">Password Confirmation<span className="text-red-500">*</span></label>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                className={`mt-1 p-2 w-full border ${formErrors.passwordConfirmation ? "border-red-500" : "border-gray-300"} rounded-lg`}
                value={formData.passwordConfirmation}
                onChange={handleInputChange}
              />
              {formErrors.passwordConfirmation && <p className="text-red-500 text-sm">{formErrors.passwordConfirmation}</p>}
            </div>

            <div>
              <label
                htmlFor="telephone"
                className="block text-sm font-medium"
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="telephone"
                name="telephone"
                className={`mt-1 p-2 w-full border ${
                  formErrors.telephone ? "border-red-500" : "border-gray-300"
                } rounded-lg`}
                value={formData.telephone}
                onChange={handleInputChange}
                maxLength={10}
              />
              {formErrors.telephone && (
                <p className="text-red-500 text-sm">
                  {formErrors.telephone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
              In-Charge ID Card
              </label>
              <input
                type="file"
                name="inchargeidcard"
                accept="image/png, image/jpeg"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="institute" className="block text-sm font-medium">
                Institute
              </label>
              <select
                id="institute"
                name="institute"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                value={formData.institute}
                onChange={handleInputChange}
              >
                <option value="">Please Select Institute</option>
                {
                  institutes.map((item:any, index:any) => 
                    <option key={index} value={item.value}>{item.label}</option>
                  )
                }
              </select>
            </div>
            {(formData.institute === 'others' || formData.institute ==='230') && (
               <div>
               
               <input
                 type="text"
                 id="other_institute"
                 name="other_institute"
                 className={`mt-1 p-2 w-full border ${
                   formErrors.other_institute ? "border-red-500" : "border-gray-300"
                 } rounded-lg`}
                 value={formData.other_institute}
                 onChange={handleInputChange}
               />
               {formErrors.other_institute && (
                 <p className="text-red-500 text-sm">{formErrors.other_institute}</p>
               )}
             </div>
            )
              
            }
            <div>
              <label htmlFor="department" className="block text-sm font-medium">
                Department
              </label>
              <select
                id="department"
                name="department"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Please Select Department</option>
                {
                  departments.map((item:any, index:any) => 
                    <option key={index} value={item.value}>{item.label}</option>
                  )
                }
              </select>
            </div>
            {(formData.department === 'others' || formData.department === "220") && (
               <div>
               
               <input
                 type="text"
                 id="other_department"
                 name="other_department"
                 className={`mt-1 p-2 w-full border ${
                   formErrors.other_department ? "border-red-500" : "border-gray-300"
                 } rounded-lg`}
                 value={formData.other_department}
                 onChange={handleInputChange}
               />
               {formErrors.other_department && (
                 <p className="text-red-500 text-sm">{formErrors.other_department}</p>
               )}
             </div>
            )
              
            }
          </div>
        </div>

        {/* Right Column - Address Information */}
        <div className="border-l pl-6">
          <h3 className="text-xl font-semibold mb-4 border-b border-gary-300 pb-3 text-indigo-500">Address Information</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium">Registered Address <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="street"
                name="street"
                className={`mt-1 p-2 w-full border rounded-lg ${formErrors.street ? "border-red-500" : "border-gray-300"}`}
                value={formData.street}
                onChange={handleInputChange}
              />
              {formErrors.street && <p className="text-red-500 text-sm">{formErrors.street}</p>}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium">Country <span className="text-red-500">*</span></label>
              <select
                id="country"
                name="country"
                className={`mt-1 p-2 w-full border rounded-lg ${formErrors.country ? "border-red-500" : "border-gray-300"}`}
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="">Select Country</option>
                <option value="IN">India</option>
              </select>
              {formErrors.country && <p className="text-red-500 text-sm">{formErrors.country}</p>}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium">
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                name="state"
                className={`mt-1 p-2 w-full border rounded-lg ${
                  formErrors.state ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.state}
                onChange={handleInputChange}
              >
                <option value="">Select State</option>
                {states
                  ?.filter((item: any) => item.value && item.title) 
                  .map((item: any, index: any) => (
                    <option key={index} value={item.value}>
                      {item.title}
                    </option>
                  ))}
                
              </select>
              {formErrors.state && (
                <p className="text-red-500 text-sm">{formErrors.state}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <select
                id="city"
                name="city"
                className={`mt-1 p-2 w-full border rounded-lg ${
                  formErrors.city ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.city}
                onChange={handleInputChange}
              >
                <option value="">Select city</option>
                {formData.state && cities[0]?.[formData.state] ? (
                  Object.entries(cities[0][formData.state]as Record<string, string>).map(([id, city]) => (
                    <option key={id} value={id}>
                      {city}
                    </option>
                  ))
                ) : (
                  <option disabled>No cities available</option>
                )}
              </select>
              {formErrors.city && (
                <p className="text-red-500 text-sm">{formErrors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium">Postal Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                className={`mt-1 p-2 w-full border rounded-lg ${formErrors.postalCode ? "border-red-500" : "border-gray-300"}`}
                value={formData.postalCode}
                onChange={handleInputChange}
                maxLength={6}
              />
              {formErrors.postalCode && <p className="text-red-500 text-sm">{formErrors.postalCode}</p>}
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="col-span-2 flex flex-col mt-2">
          <div className="flex flex-row items-center">
          <input
            type="checkbox"
            id="termsCondition"
            name="termsCondition"
            className="mr-2"
            checked={formData.termsCondition}
            onChange={handleInputChange}
          />
          <label htmlFor="termsCondition" className="text-sm">
            I accept the Terms & Conditions{" "}
            <span className="text-red-500">*</span>
          </label>
          </div>
          {formErrors.termsCondition && (
            <p className="text-red-500 text-sm d-block">{formErrors.termsCondition}</p>
          )}
        </div>
        <div className="col-span-2 text-sm text-gray-600">
          Please note that our products are meant for lab/research use only.
          Individuals ordering for personal use are requested to avoid creating
          an account. We do not facilitate shipments to residential addresses.
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            className="bg-indigo-500 text-white px-8 py-2 rounded-lg hover:bg-indigo-600"
          >
            Sign Up
          </button>
        </div>
      </form>
      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        telephone={formData.telephone}
        sendOtp={sendOtp}
        handleSubmitForm={fetchSubmitForm}
      />
      <ToastContainer />
    </div>
  );
};

export default PurchaseDepartment;
