import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import toast from "react-hot-toast";

import Swal from "sweetalert2";

import AdminActivitiesHeader from "./components/AdminActivitiesHeader";
import AdminActivitiesStats from "./components/AdminActivitiesStats";
import AdminActivitiesFilter from "./components/AdminActivitiesFilter";
import AdminActivitiesTable from "./components/AdminActivitiesTable";
import AdminActivityModal from "./components/AdminActivityModal";

const INITIAL_ACTIVITIES = [
  {
    id: 1,
    type: "event",
    titleEn: "Spiritual Alignment & Guided Meditation",
    titleNl: "Spirituele Uitlijning & Geleide Meditatie",
    descriptionEn: "Connect with your inner self in this guided collective meditation session focused on alignment and mental clarity.",
    descriptionNl: "Maak verbinding met je innerlijke zelf in deze geleide gezamenlijke meditatiesessie gericht op uitlijning en mentale helderheid.",
    host: "Elena Rostova",
    hostTitleEn: "Intuitive Coach & Spiritual Guide",
    hostTitleNl: "Intuïtieve Coach & Spirituele Gids",
    date: "2026-08-10",
    time: "19:00 - 20:30",
    price: "Free",
    priceNl: "Gratis",
    locationEn: "Zoom Webinar",
    locationNl: "Zoom Webinar",
    durationEn: "90 Mins",
    durationNl: "90 Min",
    tags: ["Meditation", "Spiritual"],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    type: "workshop",
    titleEn: "Chakra Balancing & Sound Healing Masterclass",
    titleNl: "Chakra Balanceren & Sound Healing Masterclass",
    descriptionEn: "An immersive virtual masterclass to harmonize your energy centers using crystal singing bowls and breathwork.",
    descriptionNl: "Een meeslepende virtuele masterclass om je energiecentra te harmoniseren met behulp van kristallen klankschalen en ademwerk.",
    host: "Amara Vance",
    hostTitleEn: "Sound Therapist & Energy Healer",
    hostTitleNl: "Geluidstherapeut & Energetisch Genezer",
    date: "2026-08-15",
    time: "14:00 - 17:00",
    price: "€49.00",
    priceNl: "€49,00",
    locationEn: "Google Meet (Interactive)",
    locationNl: "Google Meet (Interactief)",
    durationEn: "3 Hours",
    durationNl: "3 Uur",
    tags: ["Chakra", "Sound Healing"],
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    type: "event",
    titleEn: "Monthly Q&A with Certified Tarot Readers",
    titleNl: "Maandelijkse Q&A met Gecertificeerde Tarotlezers",
    descriptionEn: "A live interactive panel discussion answering your questions about card layouts, intuitive reading, and energy work.",
    descriptionNl: "Een live interactieve paneldiscussie waarin uw vragen over kaartleggingen, intuïtief lezen en energiewerk worden beantwoord.",
    host: "Sophia Sterling & Panel",
    hostTitleEn: "Tarot Masters & Mediums",
    hostTitleNl: "Tarotmeesters & Mediums",
    date: "2026-08-22",
    time: "20:00 - 21:30",
    price: "Free",
    priceNl: "Gratis",
    locationEn: "YouTube Live",
    locationNl: "YouTube Live",
    durationEn: "90 Mins",
    durationNl: "90 Min",
    tags: ["Tarot", "Q&A"],
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    type: "workshop",
    titleEn: "Astrology & Natal Chart Reading for Beginners",
    titleNl: "Astrologie & Geboortehoroscoop Lezen voor Beginners",
    descriptionEn: "Unlock the secrets of the stars and learn to interpret your birth chart's houses, signs, and planetary placements.",
    descriptionNl: "Ontgrendel de geheimen van de sterren en leer de huizen, tekens en planetaire posities van uw geboortehoroscoop te interpreteren.",
    host: "Alistair Crowley",
    hostTitleEn: "Master Astrologer & Author",
    hostTitleNl: "Meester Astroloog & Auteur",
    date: "2026-08-28",
    time: "10:00 - 13:00",
    price: "€65.00",
    priceNl: "€65,00",
    locationEn: "Interactive Workshops Hub",
    locationNl: "Interactieve Workshop Hub",
    durationEn: "3 Hours",
    durationNl: "3 Uur",
    tags: ["Astrology", "Zodiac"],
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80"
  }
];

const AdminActivities = () => {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const pageRef = useRef(null);

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.fromTo(
      pageRef.current.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 }
    );
  }, []);

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
    }).then((result) => {
      if (result.isConfirmed) {
        setActivities(prev => prev.filter(item => item.id !== id));
        toast.success("Activity deleted successfully");
      }
    });
  };

  const handleSave = (payload) => {
    if (editingActivity) {
      setActivities(prev => prev.map(item => item.id === editingActivity.id ? payload : item));
      toast.success("Activity updated successfully");
    } else {
      setActivities(prev => [payload, ...prev]);
      toast.success("Activity created successfully");
    }
    setShowAddEditModal(false);
  };

  // Filter items
  const filtered = activities.filter(item => {
    const matchesSearch = 
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleNl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.host.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  // Stats calculation
  const totalEvents = activities.filter(item => item.type === "event").length;
  const totalWorkshops = activities.filter(item => item.type === "workshop").length;
  const paidActivities = activities.filter(item => item.price !== "Free" && item.price !== "Gratis").length;

  return (
    <div ref={pageRef} className="flex flex-col gap-8 mx-auto">
      {/* Header */}
      <AdminActivitiesHeader onAddClick={openAddModal} />

      {/* Stats Cards */}
      <AdminActivitiesStats 
        totalEvents={totalEvents} 
        totalWorkshops={totalWorkshops} 
        paidActivities={paidActivities} 
      />

      {/* Filter and Search Bar */}
      <AdminActivitiesFilter 
        filterType={filterType} 
        setFilterType={setFilterType} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Main Table */}
      <AdminActivitiesTable 
        activities={filtered} 
        onEditClick={openEditModal} 
        onDeleteClick={handleDelete} 
      />

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
