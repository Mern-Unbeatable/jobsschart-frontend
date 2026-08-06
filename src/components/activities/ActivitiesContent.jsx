import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";

import ActivitiesHero from "./ActivitiesHero";
import ActivitiesFilter from "./ActivitiesFilter";
import ActivityCard from "./ActivityCard";
import ActivityDetailsModal from "./ActivityDetailsModal";
import ActivityRegisterModal from "./ActivityRegisterModal";
import { useGetActivitiesQuery } from "../../features/api/activityApi";

const ActivitiesContent = memo(() => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [registerActivity, setRegisterActivity] = useState(null);

  const { data: activitiesResponse, isLoading } = useGetActivitiesQuery({ limit: 100 });

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

  const filteredActivities = activities.filter((activity) => {
    const title = currentLang === "nl" ? activity.titleNl : activity.titleEn;
    const desc = currentLang === "nl" ? activity.descriptionNl : activity.descriptionEn;
    
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || activity.type === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-[#FAF8FD] min-h-screen">
      {/* Hero Section */}
      <ActivitiesHero />

      {/* Main Content Area */}
      <section className="py-12 container mx-auto px-6">
        {/* Controls Layout */}
        <ActivitiesFilter 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        {/* Grid List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E35AE]"></div>
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onOpenDetails={() => setSelectedActivity(activity)}
                onRegister={() => setRegisterActivity(activity)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-purple-100/50 shadow-sm">
            <Filter className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-semibold">
              {currentLang === "nl" 
                ? "Geen activiteiten gevonden die voldoen aan uw criteria." 
                : "No activities found matching your criteria."}
            </p>
          </div>
        )}
      </section>

      {/* Details Modal */}
      {selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onOpenRegister={() => {
            setRegisterActivity(selectedActivity);
            setSelectedActivity(null);
          }}
        />
      )}

      {/* Registration Modal */}
      {registerActivity && (
        <ActivityRegisterModal
          activity={registerActivity}
          onClose={() => setRegisterActivity(null)}
        />
      )}
    </div>
  );
});

ActivitiesContent.displayName = "ActivitiesContent";

export default ActivitiesContent;
