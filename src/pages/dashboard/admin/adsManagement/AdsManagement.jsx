import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { ROUTES } from "../../../../config";
import PublishedAdDetailsModal from "../PublishedAdDetailsModal";
import AdsHeader from "./components/AdsHeader";
import ActionsDropdown from "./components/ActionsDropdown";
import AdsTable from "./components/AdsTable";
import AdsMobileList from "./components/AdsMobileList";
import AdsPagination from "./components/AdsPagination";
import {
  useGetCampaignsQuery,
  useDeleteCampaignMutation,
} from "../../../../features/api/campaignApi";

const BUSINESS_TYPE_STYLES = {
  Online: "text-[#6E35AE]",
  Local: "text-green-500/60",
  BUSINESS: "text-[#6E35AE]",
  INDIVIDUAL: "text-green-500/60",
};

export default function AdsManagement() {
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [publishAd, setPublishAd] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageRef = useRef(null);
  const anchorRefs = useRef({});

  const { data, isLoading } = useGetCampaignsQuery({
    page: currentPage,
    limit: 7,
  });

  const [deleteCampaign] = useDeleteCampaignMutation();

  const ads = useMemo(() => data?.campaigns || [], [data]);
  const totalResults = useMemo(() => data?.meta?.total || 0, [data]);
  const pageSize = 7;
  const totalPages = useMemo(() => data?.meta?.totalPages || 1, [data]);

  const pageStart = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, totalResults);

  const activeAdId =
    typeof openDropdownId === "string"
      ? openDropdownId.replace("m-", "")
      : openDropdownId;

  useEffect(() => {
    if (!pageRef.current) return;
    const items = pageRef.current.querySelectorAll("[data-reveal]");
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.08 },
      );
    }
  }, [isLoading]);

  const handleOpenDropdown = useCallback((id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  }, []);

  const handleCloseDropdown = useCallback(() => {
    setOpenDropdownId(null);
  }, []);

  const handlePublish = useCallback(
    (id) => {
      const selectedAd = ads.find((ad) => ad.id === id);
      if (!selectedAd) return;
      setPublishAd(selectedAd);
      handleCloseDropdown();
    },
    [ads, handleCloseDropdown],
  );

  const handleClosePublishModal = useCallback(() => {
    setPublishAd(null);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      handleCloseDropdown();
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this campaign!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#EF4444",
      });

      if (!result.isConfirmed) return;

      try {
        const loadingToast = toast.loading("Deleting campaign...");
        await deleteCampaign(id).unwrap();
        toast.dismiss(loadingToast);
        toast.success("Campaign deleted successfully");
      } catch (err) {
        toast.dismiss();
        toast.error(err?.data?.message || "Failed to delete campaign");
      }
    },
    [deleteCampaign, handleCloseDropdown],
  );

  const handlePrev = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="flex flex-col gap-8">
      <AdsHeader onPublishClick={() => navigate(ROUTES.ADMIN_ADS_PUBLISHED)} />

      <div
        data-reveal
        className="bg-white rounded-xl border border-black/10 overflow-hidden"
      >
        <AdsTable
          visibleAds={ads}
          businessTypeStyles={BUSINESS_TYPE_STYLES}
          anchorRefs={anchorRefs}
          onOpenDropdown={handleOpenDropdown}
        />

        <AdsMobileList
          visibleAds={ads}
          businessTypeStyles={BUSINESS_TYPE_STYLES}
          anchorRefs={anchorRefs}
          onOpenDropdown={handleOpenDropdown}
        />

        <AdsPagination
          pageStart={pageStart}
          pageEnd={pageEnd}
          totalResults={totalResults}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      {openDropdownId !== null && (
        <ActionsDropdown
          anchorEl={anchorRefs.current[openDropdownId]}
          onClose={handleCloseDropdown}
          onSeeDetails={() => handlePublish(activeAdId)}
          onDelete={() => handleDelete(activeAdId)}
        />
      )}

      {publishAd && (
        <PublishedAdDetailsModal
          ad={publishAd}
          onClose={handleClosePublishModal}
        />
      )}
    </div>
  );
}
