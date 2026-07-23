import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";

import ActivitiesHero from "./ActivitiesHero";
import ActivitiesFilter from "./ActivitiesFilter";
import ActivityCard from "./ActivityCard";
import ActivityDetailsModal from "./ActivityDetailsModal";
import ActivityRegisterModal from "./ActivityRegisterModal";

const ACTIVITIES_DATA = [
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

const ActivitiesContent = memo(() => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [registerActivity, setRegisterActivity] = useState(null);

  const filteredActivities = ACTIVITIES_DATA.filter((activity) => {
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
        {filteredActivities.length > 0 ? (
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
