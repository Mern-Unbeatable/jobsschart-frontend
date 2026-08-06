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
        titleEn: item.titleEn || item.title || "",
        titleNl: item.titleNl || item.title || "",
        descriptionEn: item.descriptionEn || item.description || "",
        descriptionNl: item.descriptionNl || item.description || "",
        hostTitleEn: item.hostTitleEn || item.hostTitle || "",
        hostTitleNl: item.hostTitleNl || item.hostTitle || "",
        price: item.price || "",
        priceNl: item.priceNl || item.price || "",
        locationEn: item.locationEn || item.location || "",
        locationNl: item.locationNl || item.location || "",
        durationEn: item.durationEn || item.duration || "",
        durationNl: item.durationNl || item.duration || "",
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
      formData.append("title", payload.titleEn || payload.title || "");
      formData.append("description", payload.descriptionEn || payload.description || "");
      formData.append("host", payload.host || "");
      
      const hostTitle = payload.hostTitleEn || payload.hostTitle || "";
      if (hostTitle) {
        formData.append("hostTitle", hostTitle);
      }
      
      formData.append("date", payload.date || "");
      formData.append("time", payload.time || "");
      
      if (payload.price) {
        formData.append("price", payload.price);
      }
      
      const location = payload.locationEn || payload.location || "";
      if (location) {
        formData.append("location", location);
      }
      
      const duration = payload.durationEn || payload.duration || "";
      if (duration) {
        formData.append("duration", duration);
      }

      // Convert tags array to comma-separated string for form-data
      if (payload.tags && payload.tags.length > 0) {
        formData.append("tags", payload.tags.join(","));
      }

      // If a file was selected, append the file object, else keep existing image url if editing
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
