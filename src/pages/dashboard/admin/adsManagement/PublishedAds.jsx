import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { ROUTES } from "../../../../config";
import PublishedAdDetailsModal from "../PublishedAdDetailsModal";
import PublishedAdsHeader from "./components/PublishedAdsHeader";
import PublishedActionsDropdown from "./components/PublishedActionsDropdown";
import PublishedAdsTable from "./components/PublishedAdsTable";
import PublishedAdsMobileList from "./components/PublishedAdsMobileList";
import PublishedAdsPagination from "./components/PublishedAdsPagination";
import {
  useGetCampaignsQuery,
  useApproveCampaignMutation,
  useDeleteCampaignMutation,
} from "../../../../features/api/campaignApi";

const BUSINESS_TYPE_STYLES = {
  Online: "text-[#6E35AE]",
  Local: "text-green-500/60",
  BUSINESS: "text-[#6E35AE]",
  INDIVIDUAL: "text-green-500/60",
};

export default function PublishedAds() {
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [publishAd, setPublishAd] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageRef = useRef(null);
  const anchorRefs = useRef({});

  const { data, isLoading } = useGetCampaignsQuery({
    page: currentPage,
    limit: 7,
    status: "PENDING",
  });

  const [approveCampaign] = useApproveCampaignMutation();
  const [deleteCampaign] = useDeleteCampaignMutation();

  const ads = useMemo(() => {
    return (data?.campaigns || []).map((ad) => ({
      ...ad,
      name: ad.donor?.name || ad.donation?.name || "N/A",
      email: ad.donor?.email || ad.donation?.email || "N/A",
      phone: ad.donation?.phone || "N/A",
      businessType: ad.donation?.donorType || "INDIVIDUAL",
      date: ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "N/A",
    }));
  }, [data]);

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
    if (isLoading || !pageRef.current) return;
    const items = pageRef.current.querySelectorAll("[data-reveal]");
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.08 },
      );
    }
  }, [isLoading]);

  useEffect(() => {
    const handleResize = () => {
      setOpenDropdownId(null);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleConfirmPublish = useCallback(
    async (selectedAdsPage) => {
      if (!publishAd) return;
      handleClosePublishModal();

      const placementMapping = {
        "Home Page": "HOME",
        "Consultants Page": "CONSULTATION",
        "Consultants Details Page": "CONSULTATION",
        "Credit Page": "GLOBAL",
        "Webshop Page": "WEBSHOP",
        "Webshop Details Page": "WEBSHOP",
        "Checkout Page": "GLOBAL",
        "Donation Page": "DONATION",
        "Community Page": "GLOBAL",
        "Blog Page": "GLOBAL",
        "Blog Details Page": "GLOBAL",
      };

      const backendPlacement = placementMapping[selectedAdsPage] || "HOME";

      try {
        const loadingToast = toast.loading("Publishing campaign...");
        await approveCampaign({
          id: publishAd.id,
          placements: [backendPlacement],
        }).unwrap();
        toast.dismiss(loadingToast);
        toast.success("Campaign published successfully");
      } catch (err) {
        toast.dismiss();
        toast.error(err?.data?.message || "Failed to publish campaign");
      }
    },
    [publishAd, approveCampaign, handleClosePublishModal],
  );

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
      <PublishedAdsHeader onBackClick={() => navigate(ROUTES.ADMIN_ADS)} />

      <div
        data-reveal
        className="bg-white rounded-xl border border-black/10 overflow-hidden"
      >
        <PublishedAdsTable
          visibleAds={ads}
          businessTypeStyles={BUSINESS_TYPE_STYLES}
          anchorRefs={anchorRefs}
          onOpenDropdown={handleOpenDropdown}
        />

        <PublishedAdsMobileList
          visibleAds={ads}
          businessTypeStyles={BUSINESS_TYPE_STYLES}
          anchorRefs={anchorRefs}
          onOpenDropdown={handleOpenDropdown}
        />

        <PublishedAdsPagination
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
        <PublishedActionsDropdown
          anchorEl={anchorRefs.current[openDropdownId]}
          onClose={handleCloseDropdown}
          onPublish={() => handlePublish(activeAdId)}
          onDelete={() => handleDelete(activeAdId)}
        />
      )}

      {publishAd && (
        <PublishedAdDetailsModal
          ad={publishAd}
          initialAdsPage={publishAd.pageName ?? "Home Page"}
          onClose={handleClosePublishModal}
          onConfirm={handleConfirmPublish}
        />
      )}
    </div>
  );
}
