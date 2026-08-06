import React, { memo, useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const AdminActivityModal = memo(({ activity, onClose, onSave }) => {
  const [formType, setFormType] = useState("event");
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formTitleNl, setFormTitleNl] = useState("");
  const [formDescEn, setFormDescEn] = useState("");
  const [formDescNl, setFormDescNl] = useState("");
  const [formHost, setFormHost] = useState("");
  const [formHostTitleEn, setFormHostTitleEn] = useState("");
  const [formHostTitleNl, setFormHostTitleNl] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formPriceEn, setFormPriceEn] = useState("Free");
  const [formPriceNl, setFormPriceNl] = useState("Gratis");
  const [formLocationEn, setFormLocationEn] = useState("Zoom Webinar");
  const [formLocationNl, setFormLocationNl] = useState("Zoom Webinar");
  const [formDurationEn, setFormDurationEn] = useState("60 Mins");
  const [formDurationNl, setFormDurationNl] = useState("60 Min");
  const [formImage, setFormImage] = useState("");
  const [formImageFile, setFormImageFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (activity) {
      setFormType(activity.type);
      setFormTitleEn(activity.titleEn || "");
      setFormTitleNl(activity.titleNl || "");
      setFormDescEn(activity.descriptionEn || "");
      setFormDescNl(activity.descriptionNl || "");
      setFormHost(activity.host || "");
      setFormHostTitleEn(activity.hostTitleEn || "");
      setFormHostTitleNl(activity.hostTitleNl || "");
      setFormDate(activity.date || "");
      setFormTime(activity.time || "");
      setFormPriceEn(activity.price || "");
      setFormPriceNl(activity.priceNl || "");
      setFormLocationEn(activity.locationEn || "");
      setFormLocationNl(activity.locationNl || "");
      setFormDurationEn(activity.durationEn || "");
      setFormDurationNl(activity.durationNl || "");
      setFormImage(activity.image || "");
    } else {
      setFormType("event");
      setFormTitleEn("");
      setFormTitleNl("");
      setFormDescEn("");
      setFormDescNl("");
      setFormHost("");
      setFormHostTitleEn("");
      setFormHostTitleNl("");
      setFormDate("");
      setFormTime("");
      setFormPriceEn("Free");
      setFormPriceNl("Gratis");
      setFormLocationEn("Zoom Webinar");
      setFormLocationNl("Zoom Webinar");
      setFormDurationEn("60 Mins");
      setFormDurationNl("60 Min");
      setFormImage("https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80");
    }
  }, [activity]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formTitleEn || !formTitleNl || !formHost || !formDate || !formTime) {
      toast.error("Please fill in all required fields.");
      return;
    }

    onSave({
      id: activity ? activity.id : Date.now(),
      type: formType,
      titleEn: formTitleEn,
      titleNl: formTitleNl,
      descriptionEn: formDescEn,
      descriptionNl: formDescNl,
      host: formHost,
      hostTitleEn: formHostTitleEn,
      hostTitleNl: formHostTitleNl,
      date: formDate,
      time: formTime,
      price: formPriceEn,
      priceNl: formPriceNl,
      locationEn: formLocationEn,
      locationNl: formLocationNl,
      durationEn: formDurationEn,
      durationNl: formDurationNl,
      image: formImage || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      imageFile: formImageFile,
      tags: formType === "event" ? ["Meditation"] : ["Business"]
    });
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden relative animate-scale-up">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-2xl font-extrabold text-gray-900 animate-pulse">
            {activity ? "Edit Activity" : "Create New Activity"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Type Switcher */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Activity Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="activityType"
                    checked={formType === "event"}
                    onChange={() => setFormType("event")}
                    className="text-[#6E35AE] focus:ring-[#6E35AE]"
                  />
                  <span>Event</span>
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="activityType"
                    checked={formType === "workshop"}
                    onChange={() => setFormType("workshop")}
                    className="text-[#6E35AE] focus:ring-[#6E35AE]"
                  />
                  <span>Workshop</span>
                </label>
              </div>
            </div>

            {/* Grid Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Titles */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guided Meditation"
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title (Dutch) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geleide Meditatie"
                  value={formTitleNl}
                  onChange={(e) => setFormTitleNl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>

              {/* Host Info */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Host Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={formHost}
                  onChange={(e) => setFormHost(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Host Title (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Intuitive Guide"
                  value={formHostTitleEn}
                  onChange={(e) => setFormHostTitleEn(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Host Title (Dutch)</label>
                <input
                  type="text"
                  placeholder="e.g. Intuïtieve Gids"
                  value={formHostTitleNl}
                  onChange={(e) => setFormHostTitleNl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Time Slot *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 19:00 - 20:30"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (English)</label>
                <input
                  type="text"
                  value={formPriceEn}
                  onChange={(e) => setFormPriceEn(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (Dutch)</label>
                <input
                  type="text"
                  value={formPriceNl}
                  onChange={(e) => setFormPriceNl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location (English)</label>
                <input
                  type="text"
                  value={formLocationEn}
                  onChange={(e) => setFormLocationEn(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location (Dutch)</label>
                <input
                  type="text"
                  value={formLocationNl}
                  onChange={(e) => setFormLocationNl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>

              {/* Durations */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration (English)</label>
                <input
                  type="text"
                  value={formDurationEn}
                  onChange={(e) => setFormDurationEn(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration (Dutch)</label>
                <input
                  type="text"
                  value={formDurationNl}
                  onChange={(e) => setFormDurationNl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Activity Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormImageFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <div className="flex gap-4 items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#6E35AE] border border-purple-200 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
                >
                  Choose Image
                </button>
                {formImage && (
                  <img src={formImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-purple-100" />
                )}
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description (English)</label>
              <textarea
                rows="3"
                value={formDescEn}
                onChange={(e) => setFormDescEn(e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description (Dutch)</label>
              <textarea
                rows="3"
                value={formDescNl}
                onChange={(e) => setFormDescNl(e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6E35AE]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="p-6 border-t border-gray-100 flex gap-4 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#6E35AE] hover:bg-[#562590] text-white rounded-lg text-sm font-bold transition shadow cursor-pointer"
            >
              {activity ? "Save Changes" : "Create Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AdminActivityModal.displayName = "AdminActivityModal";

export default AdminActivityModal;
