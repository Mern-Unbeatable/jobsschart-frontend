import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const ActivityRegisterModal = memo(({ activity, onClose }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");

  if (!activity) return null;

  const title = currentLang === "nl" ? activity.titleNl : activity.titleEn;

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      toast.error(currentLang === "nl" ? "Vul alle velden in." : "Please fill in all fields.");
      return;
    }
    
    toast.success(t("activities.successMessage"));
    setRegName("");
    setRegEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full p-6 relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 cursor-pointer"
        >
          <X size={18} />
        </button>
        <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
          <CheckCircle className="text-[#6E35AE]" size={24} />
          <span>{t("activities.registrationModalTitle")}</span>
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          {currentLang === "nl" ? "Meld je aan voor:" : "Register for:"} <strong className="text-gray-800">{title}</strong>
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
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-[#FAF8FD]"
            >
              {currentLang === "nl" ? "Annuleren" : "Cancel"}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-[#6E35AE] text-white text-sm font-bold hover:bg-[#562590] cursor-pointer"
            >
              {t("activities.confirmRegistration")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ActivityRegisterModal.displayName = "ActivityRegisterModal";

export default ActivityRegisterModal;
