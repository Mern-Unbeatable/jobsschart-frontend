import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateVerificationInfoMutation } from "../../../../../features/api/consultantApi";

export default function VerificationSection({ profile }) {
  const [form, setForm] = useState({
    bsnNumber: profile?.bsnNumber || "",
    kvkNumber: profile?.kvkNumber || "",
    cityOfResidence: profile?.cityOfResidence || "",
    businessBankAccount: profile?.businessBankAccount || "",
    idFrontUrl: profile?.idFrontUrl || "",
    idBackUrl: profile?.idBackUrl || "",
  });
  const [updateVerification, { isLoading }] = useUpdateVerificationInfoMutation();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVerification(form).unwrap();
      toast.success("Verification information submitted for review.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit verification info");
    }
  };

  const status = profile?.verificationStatus || "UNVERIFIED";
  const statusLabel = {
    UNVERIFIED: "Not verified",
    PENDING: "Under review",
    VERIFIED: "Verified",
    REJECTED: "Rejected — please resubmit",
  }[status] || status;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-[#6E35AE]" />
        <h3 className="text-lg font-semibold text-gray-900">Identity & Business Verification</h3>
      </div>
      <p className="text-sm text-gray-500">
        Status: <span className="font-medium text-[#6E35AE]">{statusLabel}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">ID Front (URL)</label>
            <input type="url" value={form.idFrontUrl} onChange={(e) => handleChange("idFrontUrl", e.target.value)}
              placeholder="Upload ID front and paste URL"
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">ID Back (URL)</label>
            <input type="url" value={form.idBackUrl} onChange={(e) => handleChange("idBackUrl", e.target.value)}
              placeholder="Upload ID back and paste URL"
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">BSN (National ID Number)</label>
            <input type="text" value={form.bsnNumber} onChange={(e) => handleChange("bsnNumber", e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">KvK (Chamber of Commerce)</label>
            <input type="text" value={form.kvkNumber} onChange={(e) => handleChange("kvkNumber", e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">City of Residence</label>
            <input type="text" value={form.cityOfResidence} onChange={(e) => handleChange("cityOfResidence", e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Business Bank Account (IBAN)</label>
            <input type="text" value={form.businessBankAccount} onChange={(e) => handleChange("businessBankAccount", e.target.value)}
              placeholder="NL00 BANK 0123 4567 89"
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" />
          </div>
        </div>
        <button type="submit" disabled={isLoading}
          className="bg-[#6E35AE] text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60">
          {isLoading ? "Submitting…" : "Submit for Verification"}
        </button>
      </form>
    </div>
  );
}
