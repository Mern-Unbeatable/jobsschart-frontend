import React, { useState } from "react";
import { ShieldCheck, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useReviewVerificationMutation } from "../../../../../features/api/consultantApi";
import { getApiErrorMessage } from "../../../../../utils/apiErrorUtils";

export default function AdminVerificationPanel({ consultant }) {
  const raw = consultant?.raw || consultant;
  const [reviewVerification, { isLoading }] = useReviewVerificationMutation();
  const [localStatus, setLocalStatus] = useState(raw?.verificationStatus);

  if (!raw) return null;

  const status = localStatus || raw.verificationStatus || "UNVERIFIED";

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "Approve verification?",
      text: `Confirm identity documents for ${consultant.name || raw.user?.name}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6E35AE",
    });
    if (!result.isConfirmed) return;

    try {
      await reviewVerification({ id: raw.id, status: "VERIFIED" }).unwrap();
      setLocalStatus("VERIFIED");
      toast.success("Consultant verification approved.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to approve verification"), { duration: 6000 });
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "Reject verification",
      input: "textarea",
      inputLabel: "Reason for rejection (min 10 characters)",
      inputPlaceholder: "Documents unclear, please resubmit...",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      inputValidator: (value) => {
        if (!value || value.length < 10) return "Please provide at least 10 characters";
        return null;
      },
    });
    if (!result.isConfirmed) return;

    try {
      await reviewVerification({
        id: raw.id,
        status: "REJECTED",
        rejectReason: result.value,
      }).unwrap();
      setLocalStatus("REJECTED");
      toast.success("Verification rejected. Consultant can resubmit.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to reject verification"), { duration: 6000 });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-[#6E35AE]" />
        <h3 className="text-base font-semibold text-gray-800">Identity Verification</h3>
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
          status === "VERIFIED" ? "bg-green-100 text-green-700"
            : status === "PENDING" ? "bg-amber-100 text-amber-700"
              : status === "REJECTED" ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600"
        }`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div><span className="text-gray-500">BSN:</span> <span className="font-medium">{raw.bsnNumber || "—"}</span></div>
        <div><span className="text-gray-500">KvK:</span> <span className="font-medium">{raw.kvkNumber || "—"}</span></div>
        <div><span className="text-gray-500">City:</span> <span className="font-medium">{raw.cityOfResidence || "—"}</span></div>
        <div><span className="text-gray-500">IBAN:</span> <span className="font-medium">{raw.businessBankAccount || "—"}</span></div>
      </div>

      <div className="flex flex-wrap gap-4">
        {raw.idFrontUrl ? (
          <a href={raw.idFrontUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm text-[#6E35AE] font-medium hover:underline">
            View ID Front →
          </a>
        ) : (
          <span className="text-sm text-gray-400">No ID front uploaded</span>
        )}
        {raw.idBackUrl ? (
          <a href={raw.idBackUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm text-[#6E35AE] font-medium hover:underline">
            View ID Back →
          </a>
        ) : (
          <span className="text-sm text-gray-400">No ID back uploaded</span>
        )}
      </div>

      {status === "PENDING" && (
        <div className="flex gap-3 pt-2">
          <button type="button" disabled={isLoading} onClick={handleApprove}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:opacity-50">
            <CheckCircle size={16} /> Approve
          </button>
          <button type="button" disabled={isLoading} onClick={handleReject}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-50">
            <XCircle size={16} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}
