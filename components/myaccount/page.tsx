"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import Link from "next/link";

interface NavItem {
  label: string;
  link: string;
  href: string;
}

export default function SidebarNavigation() {
  const tokenApi = useSelector((state: RootState) => state.auth.token);

  const [active, setActive] = useState<string>();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const router = useRouter();

  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  const fetchdata = async () => {
    try {
      const response = await api.get("/menu/config", { headers });
      setNavItems(response.data);
    } catch (error) {
      console.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const handleNavigation = (href: string) => {
    setActive(href);
    router.push(href);
  };

  return (
    <div className="w-64 p-4 bg-gray-50 rounded-md">
      {/* For larger screens */}
      <div className="hidden md:block">
        {navItems.map((item, index) => (
          <div key={index} className="mb-2">
            <Link
              href={item.href}
              className={`block py-2 px-4 rounded ${
                active === item.href
                  ? "bg-indigo-500 text-white"
                  : "text-gray-700"
              } hover:bg-indigo-500 hover:text-white`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.href);
              }}
            >
              {item.label}
            </Link>

            {(item.label === "My Wish List" ||
              item.label === "Account Information" ||
              item.label === "My Quote Request") && (
              <div className="border-b border-gray-300 my-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* For mobile screens */}
      <div className="block w-full md:hidden my-6">
        <select
          className="w-full p-2 border rounded text-gray-700"
          onChange={(e) => handleNavigation(e.target.value)}
          value={active}
        >
          <option value="" disabled>
            Select a menu
          </option>
          {navItems.map((item, index) => (
            <option key={index} value={item.href}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
