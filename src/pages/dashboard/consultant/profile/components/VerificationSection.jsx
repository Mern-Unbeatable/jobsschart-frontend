import React, { useState } from "react";
import { ShieldCheck, Upload, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateVerificationInfoMutation } from "../../../../../features/api/consultantApi";
import { getApiErrorMessage } from "../../../../../utils/apiErrorUtils";

export default function VerificationSection({ profile }) {
  const [form, setForm] = useState({
    bsnNumber: profile?.bsnNumber || "",
    kvkNumber: profile?.kvkNumber || "",
    cityOfResidence: profile?.cityOfResidence || "",
    businessBankAccount: profile?.businessBankAccount || "",
  });
  const [idFrontFile, setIdFrontFile] = useState(null);
  const [idBackFile, setIdBackFile] = useState(null);
  const [updateVerification, { isLoading }] = useUpdateVerificationInfoMutation();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idFrontFile && !profile?.idFrontUrl) {
      toast.error("Please upload the front of your ID document.");
      return;
    }
    if (!idBackFile && !profile?.idBackUrl) {
      toast.error("Please upload the back of your ID document.");
      return;
    }

    const fd = new FormData();
    fd.append("bsnNumber", form.bsnNumber.trim());
    fd.append("kvkNumber", form.kvkNumber.trim());
    fd.append("cityOfResidence", form.cityOfResidence.trim());
    fd.append("businessBankAccount", form.businessBankAccount.replace(/\s/g, ""));
    if (idFrontFile) fd.append("idFront", idFrontFile);
    if (idBackFile) fd.append("idBack", idBackFile);

    try {
      await updateVerification(fd).unwrap();
      toast.success("Verification documents submitted. An admin will review shortly.");
      setIdFrontFile(null);
      setIdBackFile(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to submit verification"), { duration: 7000 });
    }
  };

  const status = profile?.verificationStatus || "UNVERIFIED";
  const statusLabel = {
    UNVERIFIED: "Not verified",
    PENDING: "Under review",
    VERIFIED: "Verified ✓",
    REJECTED: "Rejected — please resubmit",
  }[status] || status;

  const statusColor = {
    UNVERIFIED: "text-gray-600",
    PENDING: "text-amber-600",
    VERIFIED: "text-green-600",
    REJECTED: "text-red-600",
  }[status] || "text-gray-600";

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-[#6E35AE]" />
        <h3 className="text-lg font-semibold text-gray-900">Identity & Business Verification</h3>
      </div>
      <p className="text-sm text-gray-500">
        Status: <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
      </p>
      <p className="text-xs text-gray-400">
        Upload your ID and business details. Required for payouts. An admin will verify your documents.
      </p>

      {(profile?.idFrontUrl || profile?.idBackUrl) && (
        <div className="flex gap-4 flex-wrap">
          {profile?.idFrontUrl && (
            <a href={profile.idFrontUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-[#6E35AE] flex items-center gap-1 hover:underline">
              <ImageIcon size={14} /> View ID Front
            </a>
          )}
          {profile?.idBackUrl && (
            <a href={profile.idBackUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-[#6E35AE] flex items-center gap-1 hover:underline">
              <ImageIcon size={14} /> View ID Back
            </a>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">ID Front (passport / ID card / licence) *</label>
            <label className="mt-1 flex items-center gap-2 h-10 w-full rounded-lg border border-dashed border-gray-300 px-3 text-sm text-gray-500 cursor-pointer hover:border-[#6E35AE]">
              <Upload size={16} />
              {idFrontFile ? idFrontFile.name : "Choose image (jpg, png)"}
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => setIdFrontFile(e.target.files?.[0] || null)} />
            </label>
          </div>
          <div>
            <label className="text-sm text-gray-600">ID Back *</label>
            <label className="mt-1 flex items-center gap-2 h-10 w-full rounded-lg border border-dashed border-gray-300 px-3 text-sm text-gray-500 cursor-pointer hover:border-[#6E35AE]">
              <Upload size={16} />
              {idBackFile ? idBackFile.name : "Choose image (jpg, png)"}
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => setIdBackFile(e.target.files?.[0] || null)} />
            </label>
          </div>
          <div>
            <label className="text-sm text-gray-600">BSN (9 digits) *</label>
            <input type="text" maxLength={9} value={form.bsnNumber}
              onChange={(e) => handleChange("bsnNumber", e.target.value.replace(/\D/g, ""))}
              placeholder="123456789"
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">KvK number (8 digits) *</label>
            <input type="text" maxLength={8} value={form.kvkNumber}
              onChange={(e) => handleChange("kvkNumber", e.target.value.replace(/\D/g, ""))}
              placeholder="12345678"
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">City of residence *</label>
            <input type="text" value={form.cityOfResidence}
              onChange={(e) => handleChange("cityOfResidence", e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Business bank account (IBAN) *</label>
            <input type="text" value={form.businessBankAccount}
              onChange={(e) => handleChange("businessBankAccount", e.target.value.toUpperCase())}
              placeholder="NL00 BANK 0123 4567 89"
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm" />
          </div>
        </div>
        <button type="submit" disabled={isLoading || status === "VERIFIED"}
          className="bg-[#6E35AE] text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60">
          {isLoading ? "Submitting…" : status === "VERIFIED" ? "Already Verified" : "Submit for Verification"}
        </button>
      </form>
    </div>
  );
}
