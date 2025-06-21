"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoMdCall } from "react-icons/io";
import { FiMail, FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "@/redux/store/slices/authSlice";
import { RootState } from "@/redux/store/store";
import api from "@/services/api";
import { IoPersonCircleSharp } from "react-icons/io5";

const Topheader = () => {
  const [user, setUser] = useState<{
    firstname: string;
    lastname: string;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  // localStorage.setItem("redirectTo", pathname);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      pathname &&
      !pathname.includes("/customer/account/")
    ) {
      localStorage.setItem("redirectTo", pathname);
    }
  }, [pathname]);

  const handleSignOut = () => {
    // Clear from localStorage
    // ["authToken", "customerAddress", "quote_id", "name", "me"].forEach(item => localStorage.removeItem(item));
    localStorage.clear();
    // Dispatch the signOut action
    dispatch(signOut());
    router.push("/");
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (isSignedIn && authToken) {
      // Fetch the user data after login

      api
        .get("/customers/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })

        .then((response) => {
          const { firstname, lastname } = response.data;
          setUser({ firstname: firstname, lastname: lastname });
          localStorage.setItem("name", firstname + " " + lastname);
          localStorage.setItem("me", JSON.stringify(response.data));
        })

        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [isSignedIn]);

  return (
    <div className="flex flex-col md:block bg-customBlue w-full">
      <div className="w-11/12 mx-auto py-2 px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="hidden md:flex md:flex-row items-center text-white text-sm gap-1">
            <div className="flex items-center">
              <IoMdCall />{" "}
              <Link href="tel:+91904371730">
                <span className="font-normal ps-1">Tel +91-904371730</span>
              </Link>
            </div>{" "}
            <div className="hidden md:block">|</div>
            <div className="flex items-center">
              <FiMail />{" "}
              <Link href="mailto:info@boffinbutler.com">
                <span className="font-normal ps-1">info@boffinbutler.com</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-end md:flex-row text-white text-sm gap-1">
            <div className="flex items-center">
              {isSignedIn && user
                ? `Welcome ${user.firstname} ${user.lastname.charAt(0)}`
                : "Welcome to Boffin Butler"}
            </div>

            <div className="md:block">|</div>

            <div className="flex items-center">
              {isSignedIn ? (
                <>
                  {/* <FiLogOut />

                  <span
                    className="font-normal ps-1 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <Link href="/" className="font-normal ps-1 cursor-pointer">
                      Sign Out
                    </Link>
                  </span> */}
                  <div className="relative">
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center space-x-1 cursor-pointer text-black"
                    >
                      <IoPersonCircleSharp className="text-white w-8 h-8" />
                      <span className="font-normal text-white">Profile</span>
                    </button>

                    {open && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                        <Link
                          href="/customer/account"
                          className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/sales/order/history"
                          className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                          My Order
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <FiLogIn />

                  <Link
                    href="/customer/account/login"
                    className="font-normal ps-1 cursor-pointer"
                  >
                    Sign In
                  </Link>

                  <div className="md:block px-2">|</div>

                  <Link href="/customer/account/create">
                    <span className="font-normal ps-1 cursor-pointer">
                      Sign Up
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topheader;
