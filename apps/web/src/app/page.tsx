"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ServicesList from "@/components/ServicesList";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setLocationQuery(location);
    // Scroll to services section
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // Scroll to services section
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDscription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const categoryId = "a85dbfa6-7c8f-4ffc-a7ad-b3a85a5503e8";

  const formData = new FormData();

  const handleSubmit = async () => {
    if (file) {
      formData.append("name", name);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      formData.append("file", file);

      await fetch("http://localhost:3001/api/shops", {
        method: "POST",
        body: formData,
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImQ5MTg3YmQ1LWY4ZGQtNGQ2YS1hNjUwLTJkYmE3YTViMzNhNiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3l4YmVpZWZneHp2YW1vZGR1dnh6LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI4ZDI5OThjMy02ZDc5LTQ5ZTgtOTAzMC1jZjEwYTU0ODc4ODYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc0NDM0MzM1LCJpYXQiOjE3NzQ0MzA3MzUsImVtYWlsIjoiMjI5NDUzbUBqZHUudXoiLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiMjI5NDUzbUBqZHUudXoiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI4ZDI5OThjMy02ZDc5LTQ5ZTgtOTAzMC1jZjEwYTU0ODc4ODYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3NDQzMDczNX1dLCJzZXNzaW9uX2lkIjoiYjU4NjNlZjMtYzA5Mi00ZDlhLTk1ZWYtNzAzOGRhZWVlNmZiIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.Ek-oo8M5voj1SUhSsZE1Qz0lLuUfcQnIwPfeEL7e4nRxt6SdRS12o53njvf_pYdg3DsWtAbq7Qs8lTLA5jM1jg",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("No file selected");
    }
  };

  console.log("file", file);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="w-screen h-screen bg-red-black flex justify-center items-center">
        <div className="flex min-w-70 flex-col gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded pl-1"
            placeholder="Name"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded pl-1"
            placeholder="Address"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded pl-1"
            placeholder="Phone"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDscription(e.target.value)}
            className="border rounded pl-1"
            placeholder="Description"
          />
          <input
            type="file"
            accept="image/*"
            className="border rounded pl-1 cursor-pointer"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          <button
            onClick={() => {
              console.log("Submit");
              handleSubmit();
            }}
            className="border rounded px-2 py-1 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Categories Section */}
      <CategoriesSection
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {/* Services Section */}
      <div id="services">
        <ServicesList
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          locationQuery={locationQuery}
        />
      </div>
    </div>
  );
}
