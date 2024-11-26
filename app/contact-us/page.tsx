"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import lettersend from "@/src/assests/images/lettersend.png";
import ellipse1 from "@/src/assests/images/ellipse1.png";
import ellipse2 from "@/src/assests/images/ellipse2.png";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import Testimonial from "@/components/testimonial/Testimonial";

const ContactUs = () => {
  const [checkedSubject, setCheckedSubject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (subject: string) => {
    setCheckedSubject(subject); 
  };

  const validate = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    };
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }
    if (!formData.subject) {
      newErrors.subject = "A subject must be selected";
      isValid = false;
    }
    if (!formData.message) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <>
      <div className="bg-white p-6 w-11/12 mx-auto mb-4">
      <Breadcrumbs />
        <h2 className="text-4xl font-bold text-center mb-4">Contact Us</h2>
        <p className="text-center mb-6 pb-3 md:pb-6">
          Any question or remarks? Just write us a message!
        </p>
        <div className="flex flex-row rounded-lg p-4" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        >
          {/* Left Column */}
          <div className="md:w-2/5 md:pr-4 bg-customBlue rounded-lg p-4 md:p-8 mx-2 relative z-10">
            <h3 className="text-3xl text-white">Contact Information</h3>
            <p className="text-gray-300 py-4">
              Say something to start a live chat!
            </p>
            <div className="flex flex-col justify-between h-96 overflow-hidden relative z-50">
              <div className="flex flex-col">
                <div className="flex items-center text-white mb-2 py-4">
                  <FaPhoneAlt className="mr-2" />
                  <Link href="tel:+10123456789" className="hover:text-gray-300">
                    +1012 3456 789
                  </Link>
                </div>
                <div className="flex items-center text-white mb-2 py-4">
                  <FaEnvelope className="mr-2" />
                  <Link
                    href="mailto:demo@gmail.com"
                    className="hover:text-gray-300"
                  >
                    demo@gmail.com
                  </Link>
                </div>
                <div className="flex items-center text-white mb-2 py-4">
                  <FaMapMarkerAlt className="mr-2" />
                  <div>
                    132 Dartmouth Street Boston,<br></br> Massachusetts 02156
                    United States
                  </div>
                </div>
              </div>
              <div className="flex justify-start space-x-4 overflow-hidden">
                <Link
                  href=""
                  className="bg-black text-white rounded-full p-2 hover:bg-white hover:text-black"
                >
                  <FaTwitter />
                </Link>
                <Link
                  href=""
                  className="bg-black text-white rounded-full p-2 hover:bg-white hover:text-black"
                >
                  <FaInstagram />
                </Link>
                <Link
                  href=""
                  className="bg-black text-white rounded-full p-2 hover:bg-white hover:text-black text-center"
                >
                  <svg
                    width="16"
                    height="13"
                    viewBox="0 0 20 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.6756 1.07708C15.413 0.57029 14.0807 0.208586 12.7119 0.000983483C12.6995 -0.000843158 12.6868 0.00073445 12.6755 0.00549944C12.6641 0.0102644 12.6548 0.0179828 12.6486 0.0275932C12.4771 0.29369 12.2872 0.641745 12.1546 0.914228C10.6791 0.71839 9.17829 0.71839 7.70283 0.914228C7.55486 0.610686 7.38746 0.314672 7.20143 0.0275932C7.19519 0.018088 7.1858 0.0104586 7.17451 0.00570893C7.16321 0.00095925 7.15054 -0.000688114 7.13815 0.000983483C5.76904 0.207475 4.43645 0.569367 3.17444 1.07708C3.16364 1.08068 3.1546 1.08746 3.14888 1.09624C0.624858 4.39478 -0.0676055 7.61242 0.271933 10.7896C0.27315 10.8045 0.284102 10.8194 0.297489 10.829C1.76727 11.7812 3.41125 12.5082 5.15934 12.9791C5.17168 12.9825 5.18494 12.9823 5.1972 12.9787C5.20945 12.9751 5.22006 12.9681 5.22749 12.9588C5.60232 12.5118 5.93577 12.0403 6.22298 11.5443C6.22896 11.5341 6.23101 11.5224 6.22882 11.5111C6.22663 11.4998 6.22031 11.4894 6.21081 11.4815C6.20452 11.4763 6.19706 11.4723 6.1889 11.4698C5.66458 11.2935 5.15677 11.0818 4.67011 10.8365C4.65652 10.8297 4.64641 10.8187 4.64188 10.8056C4.63734 10.7925 4.63874 10.7784 4.64577 10.7662C4.64991 10.7583 4.65617 10.7513 4.66402 10.746C4.76625 10.6789 4.86848 10.6087 4.96584 10.5384C4.97444 10.5324 4.98476 10.5285 4.99569 10.5272C5.00662 10.5259 5.01776 10.5272 5.0279 10.531C8.21518 11.804 11.6653 11.804 14.8137 10.531C14.8242 10.527 14.8357 10.5256 14.8471 10.5269C14.8584 10.5282 14.8692 10.5322 14.8782 10.5384C14.9755 10.6087 15.0777 10.6789 15.18 10.746C15.1883 10.7513 15.1949 10.7583 15.1993 10.7664C15.2038 10.7745 15.2058 10.7834 15.2054 10.7924C15.2049 10.8013 15.2019 10.81 15.1966 10.8177C15.1913 10.8254 15.1839 10.8319 15.1751 10.8365C14.6895 11.084 14.1811 11.2955 13.6551 11.4687C13.6467 11.4714 13.6391 11.4756 13.6328 11.4811C13.6265 11.4866 13.6216 11.4933 13.6186 11.5006C13.6158 11.5077 13.6146 11.5153 13.6153 11.5228C13.6159 11.5303 13.6183 11.5376 13.6222 11.5443C13.9143 12.0392 14.249 12.5118 14.6165 12.9588C14.6239 12.9681 14.6345 12.9751 14.6468 12.9787C14.6591 12.9823 14.6723 12.9825 14.6847 12.9791C16.4357 12.5097 18.0823 11.7826 19.5538 10.829C19.5612 10.8245 19.5673 10.8187 19.5717 10.8119C19.5762 10.805 19.5788 10.7974 19.5794 10.7896C19.9858 7.11642 18.8991 3.92538 16.7 1.0973C16.6978 1.09263 16.6945 1.08842 16.6903 1.08494C16.6861 1.08145 16.6811 1.07878 16.6756 1.07708ZM6.69882 8.85456C5.73862 8.85456 4.9488 8.08395 4.9488 7.13877C4.9488 6.19253 5.72402 5.42191 6.69882 5.42191C7.68092 5.42191 8.46344 6.19891 8.44884 7.13877C8.44884 8.08395 7.67362 8.85456 6.69882 8.85456ZM13.1683 8.85456C12.2093 8.85456 11.4183 8.08395 11.4183 7.13877C11.4183 6.19253 12.1935 5.42191 13.1683 5.42191C14.1504 5.42191 14.9341 6.19891 14.9183 7.13877C14.9183 8.08395 14.1504 8.85456 13.1683 8.85456Z"
                      fill="currentColor"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 z-0">
              <div className="relative z-0">
                <Image
                  src={ellipse2}
                  alt="circle iamge2"
                  width={150}
                  height={150}
                  className="absolute right-12 bottom-12"
                />
                <Image
                  src={ellipse1}
                  alt="circle iamge1"
                  width={150}
                  height={150}
                  className=""
                />
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="md:w-3/5 md:pr-4">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col ps-10 pe-4 relative"
            >
              <div className="w-full flex flex-col space-x-4 md:flex-row md:pb-4">
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block mb-1" htmlFor="first-name">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border-b border-gray-300 p-2 w-full focus:border-indigo-500 focus:outline-none"
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block mb-1" htmlFor="last-name">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border-b border-gray-300 p-2 w-full focus:border-indigo-500 focus:outline-none"
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-x-4 md:flex-row md:pb-4">
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-b border-gray-300 p-2 w-full focus:border-indigo-500 focus:outline-none"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4 w-full md:w-1/2">
                  <label className="block mb-1" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-b border-gray-300 p-2 w-full focus:border-indigo-500 focus:outline-none"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>
              <h3 className="text-sm font-semibold mb-2">Select Subject?</h3>
              {errors.subject && (
                <p className="text-red-500">{errors.subject}</p>
              )}
              <div className="flex flex-row space-x-4 mb-4">
              {["General Inquiry", "General Inquiry 1", "General Inquiry 2"].map((subject) => (
        <div key={subject} className="inline-flex items-center">
          <label className="cursor-pointer relative">
            <input
              type="checkbox"
              checked={checkedSubject === subject} 
              onChange={(e) => handleCheckboxChange(subject)} 
              className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800 focus:outline-none relative"
              id={`check-${subject}`} 
            />
            <span className="absolute inset-0 w-3 h-3 top-[4px] left-[1px] text-center text-white opacity-0 peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </label>
          {/* Separate text span for the subject, no onClick effect on checkbox */}
          <span className="ml-2">{subject}</span>
        </div>
      ))}
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="border-b border-gray-300 p-2 w-full h-20 focus:border-indigo-500 focus:outline-none"
                  placeholder="Type your message here"
                />
                {errors.message && (
                  <p className="text-red-500">{errors.message}</p>
                )}
              </div>
              <div className="text-right">
                <button className="bg-indigo-500 text-white rounded-full py-2 px-4 hover:bg-indigo-600">
                  Send Message
                </button>
              </div>
              {!Object.values(errors).some((error) => error) && (
                <div className="absolute -bottom-[143px] right-[110px]">
                <Image
                  src={lettersend}
                  alt="lettersend-icon"
                  width={200}
                  height={150}
                  className=""
                />
              </div>
              )}
              
            </form>
          </div>
        </div>
      </div>
      <div className="flex flex-1 justify-center pb-8 w-full bg-gray-100">
          <div className="text-center w-11/12">
            <Testimonial />
          </div>
        </div>
    </>
  );
};

export default ContactUs;
