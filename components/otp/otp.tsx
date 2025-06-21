"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/services/api";

type OtpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  telephone: string;
  sendOtp: () => Promise<void>;
  handleSubmitForm: () => Promise<void>;
};

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  telephone,
  sendOtp,
  handleSubmitForm,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(30);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendActive(true);
    }
  }, [timer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").slice(0, 4);
    if (/^\d{4}$/.test(pasteData)) {
      setOtp(pasteData.split(""));
      const lastInput = document.getElementById("otp-3");
      if (lastInput) lastInput.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp();
      setTimer(30);
      setIsResendActive(false);
      setOtp(["", "", "", ""]);
    } catch (error) {
      console.log("Failed to resend OTP", error);
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue) {
      setLoading(true); // Start loading state
      try {
        // Make the API call to validate OTP
        const response = await api.post("/validate/otp", {
          telephone: telephone,
          otp: otpValue,
        });

        const { status, message } = response.data[0];

        if (status === true) {
          toast.success("OTP verified successfully!");
          onClose();
          setOtp(["", "", "", ""]);
          await handleSubmitForm();
        } else {
          console.log("Invalid OTP or error occurred", message);
          toast.error(message);
        }
      } catch (error) {
        console.log("Failed to verify OTP");
        // toast.error("Failed to verify OTP");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please enter OTP");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-center">Enter OTP</h2>
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={1}
            />
          ))}
        </div>
        <button
          className="w-full bg-indigo-500 text-white py-2 rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
        <div className="text-center mt-4">
          {isResendActive ? (
            <button
              className="text-indigo-500 hover:underline"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500">Resend OTP in {timer} seconds</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OtpModal;
