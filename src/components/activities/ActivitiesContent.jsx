import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Video, 
  Sparkles, 
  X, 
  Search, 
  CheckCircle,
  ArrowRight,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";

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
    titleEn: "Holistic Branding for Conscious Businesses",
    titleNl: "Holistische Branding voor Bewuste Bedrijven",
    descriptionEn: "Learn how to translate your spiritual values into a powerful and authentic brand identity that attracts aligned clients.",
    descriptionNl: "Leer hoe u uw spirituele waarden vertaalt naar een krachtige en authentieke merkidentiteit die passende klanten aantrekt.",
    host: "Marcus de Groot",
    hostTitleEn: "Creative Director & Brand Strategist",
    hostTitleNl: "Creatief Directeur & Merkstrateeg",
    date: "2026-08-15",
    time: "14:00 - 17:00",
    price: "€49.00",
    priceNl: "€49,00",
    locationEn: "Google Meet (Interactive)",
    locationNl: "Google Meet (Interactief)",
    durationEn: "3 Hours",
    durationNl: "3 Uur",
    tags: ["Business", "Branding"],
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    type: "workshop",
    titleEn: "SEO Mastery for Soulful Entrepreneurs",
    titleNl: "SEO-meesterschap voor Bezield Ondernemen",
    descriptionEn: "Demystify search engine optimization and build an organic traffic strategy that aligns with your message and values.",
    descriptionNl: "Demystificeer zoekmachineoptimalisatie en bouw een organische verkeersstrategie die aansluit bij uw boodschap en waarden.",
    host: "Johan Bakhuizen",
    hostTitleEn: "Search & Visibility Specialist",
    hostTitleNl: "Zoek- & Zichtbaarheidsspecialist",
    date: "2026-08-28",
    time: "10:00 - 13:00",
    price: "€65.00",
    priceNl: "€65,00",
    locationEn: "Interactive Workshops Hub",
    locationNl: "Interactieve Workshop Hub",
    durationEn: "3 Hours",
    durationNl: "3 Uur",
    tags: ["SEO", "Marketing"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  }
];

const ActivitiesContent = memo(() => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [activeTab, setActiveTab] = useState("all"); // 'all', 'event', 'workshop'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [registerActivity, setRegisterActivity] = useState(null);

  // Form states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");

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

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      toast.error(currentLang === "nl" ? "Vul alle velden in." : "Please fill in all fields.");
      return;
    }
    
    toast.success(t("activities.successMessage"));
    setRegName("");
    setRegEmail("");
    setRegisterActivity(null);
  };

  return (
    <div className="bg-[#FAF8FD] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E9D5FF]/60 via-white to-[#FAF8FD] py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,53,174,0.05),transparent_40%)]" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9D5FF] text-[#6E35AE] text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles size={14} />
            <span>{t("common.activities")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
            {t("activities.title")}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-medium mb-10 max-w-2xl mx-auto">
            {t("activities.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 container mx-auto px-6 max-w-6xl">
        {/* Controls Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          {/* Tab buttons */}
          <div className="flex bg-purple-100/50 p-1.5 rounded-2xl border border-purple-200/50 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-white text-[#6E35AE] shadow-md"
                  : "text-gray-600 hover:text-[#6E35AE]"
              }`}
            >
              {t("activities.all")}
            </button>
            <button
              onClick={() => setActiveTab("event")}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "event"
                  ? "bg-white text-[#6E35AE] shadow-md"
                  : "text-gray-600 hover:text-[#6E35AE]"
              }`}
            >
              {t("activities.events")}
            </button>
            <button
              onClick={() => setActiveTab("workshop")}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "workshop"
                  ? "bg-white text-[#6E35AE] shadow-md"
                  : "text-gray-600 hover:text-[#6E35AE]"
              }`}
            >
              {t("activities.workshops")}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder={t("activities.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-purple-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE] transition-all duration-200 shadow-sm"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Grid List */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredActivities.map((activity) => {
              const title = currentLang === "nl" ? activity.titleNl : activity.titleEn;
              const desc = currentLang === "nl" ? activity.descriptionNl : activity.descriptionEn;
              const price = currentLang === "nl" ? activity.priceNl : activity.price;
              const duration = currentLang === "nl" ? activity.durationNl : activity.durationEn;
              const location = currentLang === "nl" ? activity.locationNl : activity.locationEn;

              return (
                <div
                  key={activity.id}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-purple-100/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image / Badge */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={activity.image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
                        activity.type === "event" 
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600" 
                          : "bg-gradient-to-r from-amber-500 to-orange-500"
                      }`}>
                        {activity.type === "event" ? t("activities.events") : t("activities.workshops")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#6E35AE] transition-colors duration-200">
                        {title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                        {desc}
                      </p>

                      {/* Meta Info */}
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-purple-50/50 pt-4 mb-6">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                          <Calendar size={14} className="text-purple-600" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                          <Clock size={14} className="text-purple-600" />
                          <span>{duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                          <MapPin size={14} className="text-purple-600" />
                          <span className="truncate">{location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                          <span className="text-[#6E35AE] font-bold">{price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="p-6 pt-0 flex gap-3">
                    <button
                      onClick={() => setSelectedActivity(activity)}
                      className="flex-1 px-4 py-3 rounded-xl border border-purple-200 text-gray-700 text-xs font-bold hover:bg-[#FAF8FD] transition-colors duration-200"
                    >
                      {t("activities.viewDetails")}
                    </button>
                    <button
                      onClick={() => setRegisterActivity(activity)}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#6E35AE] text-white text-xs font-bold hover:bg-[#562590] transition-colors duration-200 flex items-center justify-center gap-1"
                    >
                      <span>{t("activities.registerNow")}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-purple-100/50 shadow-sm">
            <Filter className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-semibold">
              {currentLang === "nl" ? "Geen activiteiten gevonden die voldoen aan uw criteria." : "No activities found matching your criteria."}
            </p>
          </div>
        )}
      </section>

      {/* Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full relative animate-scale-up">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 shadow-md border border-gray-100 z-10"
            >
              <X size={18} />
            </button>
            <div className="h-48 overflow-hidden relative">
              <img
                src={selectedActivity.image}
                alt="Selected"
                className="w-full h-full object-cover"
              />
              <span className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase text-white ${
                selectedActivity.type === "event" ? "bg-purple-600" : "bg-orange-500"
              }`}>
                {selectedActivity.type === "event" ? t("activities.events") : t("activities.workshops")}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4">
                {currentLang === "nl" ? selectedActivity.titleNl : selectedActivity.titleEn}
              </h3>
              
              <div className="flex items-center gap-3 mb-6 bg-purple-50/50 p-3 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-[#E9D5FF] flex items-center justify-center text-[#6E35AE] font-bold">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{selectedActivity.host}</h4>
                  <p className="text-xs text-gray-500">
                    {currentLang === "nl" ? selectedActivity.hostTitleNl : selectedActivity.hostTitleEn}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {currentLang === "nl" ? selectedActivity.descriptionNl : selectedActivity.descriptionEn}
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-purple-50/50 pt-4 mb-6">
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("activities.date")}</h5>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                    <Calendar size={15} className="text-[#6E35AE]" />
                    <span>{selectedActivity.date}</span>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("activities.time")}</h5>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                    <Clock size={15} className="text-[#6E35AE]" />
                    <span>{selectedActivity.time} ({currentLang === "nl" ? selectedActivity.durationNl : selectedActivity.durationEn})</span>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("activities.location")}</h5>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                    <Video size={15} className="text-[#6E35AE]" />
                    <span>{currentLang === "nl" ? selectedActivity.locationNl : selectedActivity.locationEn}</span>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("activities.price")}</h5>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#6E35AE]">
                    <span>{currentLang === "nl" ? selectedActivity.priceNl : selectedActivity.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-[#FAF8FD] transition-colors duration-200"
                >
                  {t("activities.close")}
                </button>
                <button
                  onClick={() => {
                    setRegisterActivity(selectedActivity);
                    setSelectedActivity(null);
                  }}
                  className="flex-1 px-4 py-3.5 rounded-xl bg-[#6E35AE] text-white text-sm font-bold hover:bg-[#562590] transition-colors duration-200 flex items-center justify-center gap-1"
                >
                  <span>{t("activities.registerNow")}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {registerActivity && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full p-6 relative animate-scale-up">
            <button
              onClick={() => setRegisterActivity(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
              <CheckCircle className="text-[#6E35AE]" size={24} />
              <span>{t("activities.registrationModalTitle")}</span>
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {currentLang === "nl" ? "Meld je aan voor:" : "Register for:"} <strong className="text-gray-800">{currentLang === "nl" ? registerActivity.titleNl : registerActivity.titleEn}</strong>
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  {currentLang === "nl" ? "Volledige Naam" : "Full Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("activities.namePlaceholder")}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-4 py-3 border border-purple-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  {currentLang === "nl" ? "E-mailadres" : "Email Address"}
                </label>
                <input
                  type="email"
                  required
                  placeholder={t("activities.emailPlaceholder")}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-purple-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setRegisterActivity(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-[#FAF8FD]"
                >
                  {currentLang === "nl" ? "Annuleren" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#6E35AE] text-white text-sm font-bold hover:bg-[#562590]"
                >
                  {t("activities.confirmRegistration")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

ActivitiesContent.displayName = "ActivitiesContent";

export default ActivitiesContent;
