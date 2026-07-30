import React, { memo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  User,
  Building2,
  Globe,
  TrendingUp,
  MapPin,
  Link,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { useCreateCheckoutMutation } from "../../../features/api/paymentApi";
import toast from "react-hot-toast";
import PaymentMethodSelector from "../../../components/payment/PaymentMethodSelector";

const MIN_DONATION_AMOUNT = 100;

const DonationFormSection = memo(({ formData, setFormData }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [createCheckout, { isLoading: isCheckingOut }] =
    useCreateCheckoutMutation();
  const [amountError, setAmountError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const isBusiness = formData.donorType === "business";

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const getAmountError = (value) => {
    if (!value) {
      return t(
        "donationForm.fields.amount.requiredError",
        "Please enter a donation amount.",
      );
    }
    const amountValue = Number(value);
    if (Number.isNaN(amountValue) || amountValue < MIN_DONATION_AMOUNT) {
      return t(
        "donationForm.fields.amount.minError",
        "Minimum donation amount is €100.00.",
      );
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.amount
    ) {
      toast.error(
        t(
          "donationForm.fields.requiredError",
          "Please fill in all required fields.",
        ),
      );
      return;
    }

    const amountValidationError = getAmountError(formData.amount);
    if (amountValidationError) {
      setAmountError(amountValidationError);
      toast.error(amountValidationError);
      return;
    }
    setAmountError("");

    try {
      const data = new FormData();
      data.append("type", "DONATION");
      data.append("donationData[donorType]", formData.donorType.toUpperCase());
      data.append("donationData[name]", formData.name);
      data.append("donationData[email]", formData.email);
      data.append("donationData[phone]", formData.phone);
      data.append("donationData[amount]", formData.amount);
      data.append("donationData[benefit]", formData.benefit);

      if (formData.donorType === "business") {
        data.append(
          "donationData[businessType]",
          formData.businessType === "online"
            ? "ONLINE_BUSINESS"
            : "LOCAL_BUSINESS",
        );
        data.append("donationData[businessName]", formData.businessName);
        data.append("donationData[description]", formData.description);
        if (formData.businessType === "online") {
          data.append("donationData[websiteUrl]", formData.websiteUrl);
        } else {
          data.append("donationData[location]", formData.location);
        }
        if (formData.image) {
          data.append("donationData[image]", formData.image);
        }
      }

      if (paymentMethod) {
        data.append("paymentMethod", paymentMethod);
      }

      const result = await createCheckout(data).unwrap();
      if (result?.url) {
        window.location.href = result.url;
      } else {
        toast.error("Could not initiate payment. Please try again.");
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Payment failed. Please try again.",
      );
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 pb-14 md:pb-16 lg:pb-20">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {t("donationForm.header.title")}
        </h2>
        <p className="text-gray-500 text-base">
          {t("donationForm.header.subtitle")}
        </p>
      </div>

      {/* Quote Box */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-12 ">
        <p className="text-gray-700 font-bold text-xl mb-2 ">
          {t("donationForm.quote")}
        </p>
        <p className="text-gray-400 text-base">
          {t("donationForm.attribution")}
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-xl  border border-gray-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-[#F1EBF7] p-4 lg:p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-1 ">
            {t("donationForm.formHeader.title")}
          </h3>
          <p className="text-gray-500 text-base">
            {t("donationForm.formHeader.subtitle")}
          </p>
        </div>

        <div className="p-4 lg:p-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Standard Inputs */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-base  text-gray-600 mb-2">
                  {t("donationForm.fields.name.label")}
                </label>
                <input
                  type="text"
                  placeholder={t("donationForm.fields.name.placeholder")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-green-500/60"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base  text-gray-600 mb-2">
                    {t("donationForm.fields.email.label")}
                  </label>
                  <input
                    type="email"
                    placeholder={t("donationForm.fields.email.placeholder")}
                    className="w-full px-4 py-3 border border-gray-200 bg-gray-100 cursor-not-allowed rounded-md text-sm focus:outline-none"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-base  text-gray-600 mb-2">
                    {t("donationForm.fields.phone.label")}
                  </label>
                  <input
                    type="tel"
                    placeholder={t("donationForm.fields.phone.placeholder")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-green-500/60"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base  text-gray-600 mb-2">
                    {t("donationForm.fields.amount.label")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={t("donationForm.fields.amount.placeholder")}
                    className={`w-full px-4 py-3 border rounded-md text-sm focus:outline-none ${
                      amountError
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500/60"
                    }`}
                    value={formData.amount}
                    onChange={(e) => {
                      const nextAmount = e.target.value;
                      setFormData({ ...formData, amount: nextAmount });
                      if (amountError) {
                        setAmountError(getAmountError(nextAmount));
                      }
                    }}
                    onBlur={() => {
                      if (formData.amount) {
                        setAmountError(getAmountError(formData.amount));
                      }
                    }}
                  />
                  {amountError ? (
                    <p className="mt-1.5 text-xs text-red-500">{amountError}</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-gray-500">
                      {t(
                        "donationForm.fields.amount.hint",
                        "Minimum donation: €100.00",
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-base text-gray-600 mb-2">
                    Benefit / Support Cause
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-green-500/60 bg-white"
                    value={formData.benefit}
                    onChange={(e) =>
                      setFormData({ ...formData, benefit: e.target.value })
                    }
                  >
                    <option value="Feed a Family">Feed a Family</option>
                    <option value="Support Education">Support Education</option>
                    <option value="Medical Support">Medical Support</option>
                    <option value="General Fund">General Fund</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Donator Type Selection */}
            <div className="pt-4">
              <label className="block text-lg text-gray-600 mb-4">
                {t("donationForm.donorType.label")}
              </label>
              <div className="flex gap-4 max-w-md">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, donorType: "individual" })
                  }
                  className={`flex-1 py-6 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                    formData.donorType === "individual"
                      ? "border-green-500/60 bg-[#F5F1FD]"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <User
                    size={20}
                    className={
                      formData.donorType === "individual"
                        ? "text-green-500/60"
                        : "text-gray-400"
                    }
                  />
                  <span className="text-base font-bold text-gray-700">
                    {t("donationForm.donorType.individual")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, donorType: "business" })
                  }
                  className={`flex-1 py-6 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                    formData.donorType === "business"
                      ? "border-green-500/60 bg-[#F5F1FD]"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <Building2
                    size={20}
                    className={
                      formData.donorType === "business"
                        ? "text-green-500/60"
                        : "text-gray-400"
                    }
                  />
                  <span className="text-base font-bold text-gray-700">
                    {t("donationForm.donorType.business")}
                  </span>
                </button>
              </div>
            </div>

            {/* Conditional Business Fields */}
            {isBusiness && (
              <div className="space-y-6 pt-6 border-t border-gray-100 animate-in fade-in duration-500">
                {/* Business Type Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-full w-fit">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, businessType: "local" })
                    }
                    className={`px-6 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                      formData.businessType === "local"
                        ? "bg-white shadow-sm text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    <MapPin size={12} /> {t("donationForm.businessType.local")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, businessType: "online" })
                    }
                    className={`px-6 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                      formData.businessType === "online"
                        ? "bg-white shadow-sm text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    <Globe size={12} /> {t("donationForm.businessType.online")}
                  </button>
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-600 mb-2">
                    {t("donationForm.fields.businessName.label")}
                  </label>
                  <input
                    type="text"
                    placeholder={t(
                      "donationForm.fields.businessName.placeholder",
                    )}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded text-sm focus:outline-none"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-base font-bold text-gray-600">
                      {t("donationForm.fields.description.label")}
                    </label>
                    <span className="text-[10px] text-gray-400">
                      {formData.description.length}/200
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={200}
                    placeholder={t(
                      "donationForm.fields.description.placeholder",
                    )}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded text-sm focus:outline-none resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-600 mb-2">
                    {formData.businessType === "online"
                      ? t("donationForm.fields.website.label")
                      : t("donationForm.fields.location.label")}
                  </label>
                  <div className="relative">
                    {formData.businessType === "online" ? (
                      <Link
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    ) : (
                      <MapPin
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    )}
                    <input
                      type="text"
                      placeholder={
                        formData.businessType === "online"
                          ? t("donationForm.fields.website.placeholder")
                          : t("donationForm.fields.location.placeholder")
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded text-sm focus:outline-none"
                      value={
                        formData.businessType === "online"
                          ? formData.websiteUrl
                          : formData.location
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [formData.businessType === "online"
                            ? "websiteUrl"
                            : "location"]: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-600 mb-2">
                    {t("donationForm.fields.image.label")}
                  </label>
                  <div
                    onClick={handleFileClick}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-white hover:border-green-500/60 cursor-pointer transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {formData.image ? (
                      <div className="flex flex-col items-center gap-2">
                        {formData.image instanceof File && (
                          <img
                            src={URL.createObjectURL(formData.image)}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                        <span className="text-xs text-gray-500 font-medium">
                          {formData.image.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={28} className="text-gray-300" />
                        <p className="text-[11px] text-gray-400 font-medium">
                          {t("donationForm.fields.image.placeholder")}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Benefits Footer */}
            <div className="bg-gray-50/50 rounded-2xl p-6 mt-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-gray-600" />
                <h4 className="text-base font-bold text-gray-800">
                  {t("donationForm.benefits.title")}
                </h4>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                  <Globe size={14} className="text-gray-400" />
                  <span className="text-base text-gray-600 font-bold">
                    {t("donationForm.benefits.adPlacement")}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                  <TrendingUp size={14} className="text-gray-400" />
                  <span className="text-base text-gray-600 font-bold">
                    {t("donationForm.benefits.visibility")}
                  </span>
                </div>
              </div>
            </div>

            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
              className="mt-6"
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={isCheckingOut}
                className="bg-green-500/60  text-white text-sm font-bold py-3 px-8 rounded transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCheckingOut && (
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                )}
                {isCheckingOut
                  ? "Processing..."
                  : t("donationForm.button", {
                      amount: formData.amount || "100",
                    })}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

DonationFormSection.displayName = "DonationFormSection";

export default DonationFormSection;
