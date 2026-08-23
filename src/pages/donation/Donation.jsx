import React, { memo, useState, useEffect } from "react";
import { useSEO } from "../../hooks/useSEO";
import HeroSection from "./sections/HeroSection";
import ImpactSection from "./sections/ImpactSection";
import DonationFormSection from "./sections/DonationFormSection";
import CommonAdsSection from "../../components/CommonAdsSection";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/slices/authSlice";

const Donation = memo(() => {
  const user = useSelector(selectUser);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    amount: "",
    donorType: "individual",
    benefit: "",
    businessType: "local",
    businessName: "",
    description: "",
    websiteUrl: "",
    location: "",
    image: null,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  useSEO({
    title: "Donation",
    description: "Make a difference through donations",
    keywords: ["donation", "support", "charity"],
  });

  return (
    <div className="min-h-screen bg-[#F3FAF5]">
      <HeroSection />
      <ImpactSection />

      <DonationFormSection formData={formData} setFormData={setFormData} />
      <CommonAdsSection
        containerClassName="container mx-auto pb-14 md:pb-20 px-4 lg:px-6"
        title="Advertisement Area"
        titleClassName="text-gray-800 font-bold text-2xl tracking-widest uppercase"
        placement="DONATION"
      />
    </div>
  );
});

Donation.displayName = "Donation";

export default Donation;
