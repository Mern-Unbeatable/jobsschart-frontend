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
  CreditCard,
  Landmark,
} from "lucide-react";
import { useCreateCheckoutMutation } from "../../../features/api/paymentApi";
import { redirectToMollieCheckout } from "../../../utils/mollieCheckout";
import toast from "react-hot-toast";

const labelClass = "block text-lg font-semibold text-gray-800 mb-2.5";
const inputClass =
  "w-full px-4 py-3.5 border border-emerald-200 bg-white rounded-lg text-base md:text-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const DonationFormSection = memo(({ formData, setFormData }) => {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);
  const [createCheckout, { isLoading: isCheckingOut }] =
    useCreateCheckoutMutation();
  const [amountError, setAmountError] = useState("");

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
      return t("donationForm.fields.amount.requiredError");
    }
    const amountValue = Number(value);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return t("donationForm.fields.amount.invalidError");
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
      toast.error(t("donationForm.fields.requiredError"));
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
      data.append("donationData[benefit]", formData.benefit || "");
      data.append(
        "donationData[sourceLang]",
        i18n.language?.startsWith("nl") ? "nl" : "en",
      );

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

      const result = await createCheckout(data).unwrap();
      if (!redirectToMollieCheckout(result)) {
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

  const paymentMethods = [
    {
      key: "ideal",
      label: t("donationForm.paymentMethods.ideal"),
      icon: Landmark,
    },
    {
      key: "visa",
      label: t("donationForm.paymentMethods.visa"),
      icon: CreditCard,
    },
    {
      key: "bank",
      label: t("donationForm.paymentMethods.bank"),
      icon: Landmark,
    },
  ];

  return (
    <div
      id="donation-form"
      className="container mx-auto px-4 lg:px-6 pb-14 md:pb-16 lg:pb-20"
    >
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t("donationForm.header.title")}
        </h2>
        <p className="text-gray-700 text-lg md:text-xl font-medium">
          {t("donationForm.header.subtitle")}
        </p>
      </div>

      <div className="bg-emerald-50 rounded-xl p-5 md:p-6 border border-emerald-200 mb-8">
        <p className="text-gray-900 font-semibold text-xl md:text-2xl mb-2">
          {t("donationForm.quote")}
        </p>
        <p className="text-gray-700 text-base md:text-lg">
          {t("donationForm.attribution")}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden shadow-sm">
        <div className="bg-emerald-50 p-5 lg:p-6 border-b border-emerald-200">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t("donationForm.formHeader.title")}
          </h3>
          <p className="text-gray-700 text-base md:text-lg font-medium leading-relaxed">
            {t("donationForm.formHeader.subtitle")}
          </p>
        </div>

        <div className="p-4 lg:p-6 bg-[#F7FCF9]">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className={labelClass}>
                  {t("donationForm.fields.name.label")}
                </label>
                <input
                  type="text"
                  placeholder={t("donationForm.fields.name.placeholder")}
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {t("donationForm.fields.email.label")}
                  </label>
                  <input
                    type="email"
                    placeholder={t("donationForm.fields.email.placeholder")}
                    className={`${inputClass} bg-emerald-50 cursor-not-allowed`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {t("donationForm.fields.phone.label")}
                  </label>
                  <input
                    type="tel"
                    placeholder={t("donationForm.fields.phone.placeholder")}
                    className={inputClass}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  {t("donationForm.fields.amount.label")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder={t("donationForm.fields.amount.placeholder")}
                  className={`${inputClass} ${
                    amountError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : ""
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
                  <p className="mt-2 text-sm md:text-base text-red-600 font-medium">
                    {amountError}
                  </p>
                ) : (
                  <p className="mt-2 text-sm md:text-base text-gray-600 font-medium">
                    {t("donationForm.fields.amount.hint")}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  {t("donationForm.fields.benefit.label")}
                </label>
                <textarea
                  rows={3}
                  placeholder={t("donationForm.fields.benefit.placeholder")}
                  className={`${inputClass} resize-none`}
                  value={formData.benefit}
                  onChange={(e) =>
                    setFormData({ ...formData, benefit: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-lg md:text-xl font-semibold text-gray-800 mb-3">
                {t("donationForm.donorType.label")}
              </label>
              <div className="flex gap-3 max-w-lg">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, donorType: "individual" })
                  }
                  className={`flex-1 py-5 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    formData.donorType === "individual"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-emerald-200 bg-white"
                  }`}
                >
                  <User
                    size={24}
                    className={
                      formData.donorType === "individual"
                        ? "text-emerald-600"
                        : "text-gray-500"
                    }
                  />
                  <span className="text-base md:text-lg font-bold text-gray-800 text-center px-1">
                    {t("donationForm.donorType.individual")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, donorType: "business" })
                  }
                  className={`flex-1 py-5 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    formData.donorType === "business"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-emerald-200 bg-white"
                  }`}
                >
                  <Building2
                    size={24}
                    className={
                      formData.donorType === "business"
                        ? "text-emerald-600"
                        : "text-gray-500"
                    }
                  />
                  <span className="text-base md:text-lg font-bold text-gray-800 text-center px-1">
                    {t("donationForm.donorType.business")}
                  </span>
                </button>
              </div>
            </div>

            {isBusiness && (
              <div className="space-y-5 pt-4 border-t border-emerald-100">
                <div className="flex bg-emerald-50 p-1 rounded-full w-fit">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, businessType: "local" })
                    }
                    className={`px-5 py-2 rounded-full text-base font-bold flex items-center gap-2 transition-all ${
                      formData.businessType === "local"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    <MapPin size={14} /> {t("donationForm.businessType.local")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, businessType: "online" })
                    }
                    className={`px-5 py-2 rounded-full text-base font-bold flex items-center gap-2 transition-all ${
                      formData.businessType === "online"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    <Globe size={14} /> {t("donationForm.businessType.online")}
                  </button>
                </div>

                <div>
                  <label className={labelClass}>
                    {t("donationForm.fields.businessName.label")}
                  </label>
                  <input
                    type="text"
                    placeholder={t(
                      "donationForm.fields.businessName.placeholder",
                    )}
                    className={inputClass}
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2.5">
                    <label className="block text-lg font-semibold text-gray-800">
                      {t("donationForm.fields.description.label")}
                    </label>
                    <span className="text-sm text-gray-500 font-medium">
                      {formData.description.length}/200
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={200}
                    placeholder={t(
                      "donationForm.fields.description.placeholder",
                    )}
                    className={`${inputClass} resize-none`}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {formData.businessType === "online"
                      ? t("donationForm.fields.website.label")
                      : t("donationForm.fields.location.label")}
                  </label>
                  <div className="relative">
                    {formData.businessType === "online" ? (
                      <Link
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                    ) : (
                      <MapPin
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                    )}
                    <input
                      type="text"
                      placeholder={
                        formData.businessType === "online"
                          ? t("donationForm.fields.website.placeholder")
                          : t("donationForm.fields.location.placeholder")
                      }
                      className={`${inputClass} pl-10`}
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
                  <label className={labelClass}>
                    {t("donationForm.fields.image.label")}
                  </label>
                  <div
                    onClick={handleFileClick}
                    className="border-2 border-dashed border-emerald-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-white hover:border-emerald-500 cursor-pointer transition-colors"
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
                            className="w-24 h-24 object-cover rounded-lg border border-emerald-200"
                          />
                        )}
                        <span className="text-sm md:text-base text-gray-700 font-medium">
                          {formData.image.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={32} className="text-emerald-500" />
                        <p className="text-sm md:text-base text-gray-600 font-medium">
                          {t("donationForm.fields.image.placeholder")}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={18} className="text-emerald-600" />
                    <h4 className="text-lg font-bold text-gray-900">
                      {t("donationForm.benefits.title")}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-emerald-200">
                      <Globe size={16} className="text-emerald-600" />
                      <span className="text-base text-gray-800 font-semibold">
                        {t("donationForm.benefits.adPlacement")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-emerald-200">
                      <TrendingUp size={16} className="text-emerald-600" />
                      <span className="text-base text-gray-800 font-semibold">
                        {t("donationForm.benefits.visibility")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-emerald-200 bg-white p-5">
              <p className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                {t("donationForm.paymentMethods.title")}
              </p>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map(({ key, label, icon: Icon }) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-base font-medium text-gray-800"
                  >
                    <Icon size={16} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isCheckingOut}
                className="w-full sm:w-auto min-w-[240px] justify-center bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold py-4 px-10 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-md shadow-emerald-200"
              >
                {isCheckingOut && (
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                )}
                {isCheckingOut
                  ? t("donationForm.processing")
                  : formData.amount
                    ? t("donationForm.buttonWithAmount", {
                        amount: formData.amount,
                      })
                    : t("donationForm.button")}
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
