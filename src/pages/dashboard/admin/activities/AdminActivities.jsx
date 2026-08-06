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
  const { data: activitiesResponse, isLoading } = useGetActivitiesQuery({ page, limit: 3});
  const [createActivity] = useCreateActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [deleteActivity] = useDeleteActivityMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const pageRef = useRef(null);

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
      const body = {
        type: payload.type,
        title: payload.titleEn || payload.title,
        description: payload.descriptionEn || payload.description,
        host: payload.host,
        hostTitle: payload.hostTitleEn || payload.hostTitle,
        date: payload.date,
        time: payload.time,
        price: payload.price,
        location: payload.locationEn || payload.location,
        duration: payload.durationEn || payload.duration,
        tags: payload.tags || [],
        image: payload.image,
      };

      if (editingActivity) {
        await updateActivity({ id: editingActivity.id || editingActivity._id, body }).unwrap();
        toast.success("Activity updated successfully");
      } else {
        await createActivity(body).unwrap();
        toast.success("Activity created successfully");
      }
      setShowAddEditModal(false);
    } catch (error) {
      toast.error("Failed to save activity");
    }
  };

  // Filter items
  const filtered = activities.filter(item => {
    const titleEn = item.titleEn || "";
    const titleNl = item.titleNl || "";
    const host = item.host || "";
    const matchesSearch = 
      titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      titleNl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

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
          activities={filtered} 
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
