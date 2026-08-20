import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import toast from "react-hot-toast";

import Swal from "sweetalert2";

import AdminActivitiesHeader from "./components/AdminActivitiesHeader";
import AdminActivitiesStats from "./components/AdminActivitiesStats";
import AdminActivitiesFilter from "./components/AdminActivitiesFilter";
import AdminActivitiesTable from "./components/AdminActivitiesTable";
import AdminActivityModal from "./components/AdminActivityModal";

import {
  useGetActivitiesQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation
} from "../../../../features/api/activityApi";
import { resolveI18n } from "../../../../utils/resolveI18n";

const AdminActivities = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const queryParams = {
    page,
    limit: 3,
    ...(filterType !== "all" && { type: filterType }),
    ...(searchQuery.trim() !== "" && { search: searchQuery.trim() })
  };

  const { data: activitiesResponse, isLoading } = useGetActivitiesQuery(queryParams);
  const [createActivity] = useCreateActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [deleteActivity] = useDeleteActivityMutation();

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const pageRef = useRef(null);

  // Reset page to 1 when filters change to avoid page index mismatch
  useEffect(() => {
    setPage(1);
  }, [filterType, searchQuery]);

  // Normalize backend fields to frontend expected fields
  const rawActivities = activitiesResponse?.activities || activitiesResponse?.data || [];
  const activities = Array.isArray(rawActivities)
    ? rawActivities.map(item => ({
        ...item,
        id: item.id || item._id,
        titleEn: resolveI18n(item.title, 'en') || item.titleEn || "",
        titleNl: resolveI18n(item.title, 'nl') || item.titleNl || "",
        descriptionEn: resolveI18n(item.description, 'en') || item.descriptionEn || "",
        descriptionNl: resolveI18n(item.description, 'nl') || item.descriptionNl || "",
        hostTitleEn: resolveI18n(item.hostTitle, 'en') || item.hostTitleEn || "",
        hostTitleNl: resolveI18n(item.hostTitle, 'nl') || item.hostTitleNl || "",
        price: item.price || "",
        priceNl: item.priceNl || item.price || "",
        locationEn: resolveI18n(item.location, 'en') || item.locationEn || "",
        locationNl: resolveI18n(item.location, 'nl') || item.locationNl || "",
        durationEn: resolveI18n(item.duration, 'en') || item.durationEn || "",
        durationNl: resolveI18n(item.duration, 'nl') || item.durationNl || "",
      }))
    : [];

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.fromTo(
      pageRef.current.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 }
    );
  }, [activities.length]);

  const openAddModal = () => {
    setEditingActivity(null);
    setShowAddEditModal(true);
  };

  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setShowAddEditModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6E35AE",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteActivity(id).unwrap();
          toast.success("Activity deleted successfully");
        } catch (error) {
          toast.error("Failed to delete activity");
        }
      }
    });
  };

  const handleSave = async (payload) => {
    try {
      const formData = new FormData();
      formData.append("type", payload.type);
      formData.append("title", JSON.stringify({
        en: payload.titleEn || payload.title || "",
        nl: payload.titleNl || payload.titleEn || payload.title || "",
      }));
      formData.append("description", JSON.stringify({
        en: payload.descriptionEn || payload.description || "",
        nl: payload.descriptionNl || payload.descriptionEn || payload.description || "",
      }));
      formData.append("host", payload.host || "");
      formData.append("sourceLang", "en");

      const hostTitleEn = payload.hostTitleEn || payload.hostTitle || "";
      const hostTitleNl = payload.hostTitleNl || hostTitleEn;
      if (hostTitleEn || hostTitleNl) {
        formData.append("hostTitle", JSON.stringify({ en: hostTitleEn, nl: hostTitleNl }));
      }

      formData.append("date", payload.date || "");
      formData.append("time", payload.time || "");

      if (payload.price) {
        formData.append("price", payload.price);
      }

      const locationEn = payload.locationEn || payload.location || "";
      const locationNl = payload.locationNl || locationEn;
      if (locationEn || locationNl) {
        formData.append("location", JSON.stringify({ en: locationEn, nl: locationNl }));
      }

      const durationEn = payload.durationEn || payload.duration || "";
      const durationNl = payload.durationNl || durationEn;
      if (durationEn || durationNl) {
        formData.append("duration", JSON.stringify({ en: durationEn, nl: durationNl }));
      }

      if (payload.tags && payload.tags.length > 0) {
        formData.append("tags", payload.tags.join(","));
      }

      if (payload.imageFile) {
        formData.append("image", payload.imageFile);
      } else if (payload.image && !payload.image.startsWith("data:")) {
        formData.append("image", payload.image);
      }

      if (editingActivity) {
        await updateActivity({ id: editingActivity.id || editingActivity._id, body: formData }).unwrap();
        toast.success("Activity updated successfully");
      } else {
        await createActivity(formData).unwrap();
        toast.success("Activity created successfully");
      }
      setShowAddEditModal(false);
    } catch (error) {
      toast.error("Failed to save activity");
    }
  };

  return (
    <div ref={pageRef} className="flex flex-col gap-8 mx-auto">
      {/* Header */}
      <AdminActivitiesHeader onAddClick={openAddModal} />

      {/* Stats Cards */}
      <AdminActivitiesStats />

      {/* Filter and Search Bar */}
      <AdminActivitiesFilter 
        filterType={filterType} 
        setFilterType={setFilterType} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Main Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6E35AE]"></div>
        </div>
      ) : (
        <AdminActivitiesTable 
          activities={activities} 
          onEditClick={openEditModal} 
          onDeleteClick={handleDelete} 
          page={page}
          totalResults={activitiesResponse?.meta?.total || activitiesResponse?.data?.meta?.total || 0}
          pageSize={activitiesResponse?.meta?.limit || activitiesResponse?.data?.meta?.limit || 10}
          totalPages={activitiesResponse?.meta?.totalPages || activitiesResponse?.data?.meta?.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {/* Add / Edit Modal */}
      {showAddEditModal && (
        <AdminActivityModal
          activity={editingActivity}
          onClose={() => setShowAddEditModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminActivities;
