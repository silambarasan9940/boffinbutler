"use client";
import React, { useState, useEffect } from "react";
import FreebiesCard from "@/components/freebies-card/FreebiesCard";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import api from "@/services/api/index";
import { ToastContainer } from "react-toastify";
interface Freebie {
  catalog_id: string;
  image_url: string;
  name: string;
  coins: number;
  description: string;
 
}

const FreebiesPage: React.FC = () => {
  const [freebies, setFreebies] = useState<Freebie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await api.get("/freebies");
      const freebiesData: Freebie[] = response.data;
      setFreebies(freebiesData);
    } catch (error) {
      console.error("Error fetching freebies:", error);
      setError("Failed to load freebies.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Breadcrumbs />
      <div className="w-11/12 mx-auto pt-6">
        {loading ? (
          <p>Loading freebies...</p>
        ) : error ? (
          <p>{error}</p>
        ) : freebies.length === 0 ? (
          <p>No freebies available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
             {freebies.map((freebie) => (
              <FreebiesCard
                key={freebie.catalog_id}
                catalog_id={freebie.catalog_id}
                image_url={freebie.image_url}
                name={freebie.name}
                coins={freebie.coins}
                description={freebie.description}
                
              />
            ))}
            <ToastContainer />
          </div>
        )}
      </div>
    </>
  );
};

export default FreebiesPage;
