import React, { useEffect, useRef } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Languages,
  Award,
  Clock,
} from "lucide-react";
import { gsap } from "gsap";
import StatusBadge from "./StatusBadge";
import InfoCard from "./InfoCard";
import AdminVerificationPanel from "./AdminVerificationPanel";

function ConsultantDetail({ consultant: c, onBack }) {
  const wrapRef = useRef(null);
  useEffect(() => {
    if (!wrapRef.current) return;
    const cards = wrapRef.current.querySelectorAll(".detail-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.35, ease: "power2.out" },
    );
  }, [c.id]);

  return (
    <div ref={wrapRef} className="flex flex-col gap-3">
      <button
        onClick={onBack}
        className="detail-card inline-flex items-center gap-1.5 text-base text-gray-600 hover:text-green-500/60 font-medium transition-colors w-fit group cursor-pointer border-0 bg-transparent"
      >
        <ArrowLeft
          size={18}
          className="transition-transform group-hover:-translate-x-0.5"
        />
        Back
      </button>

      <div className="detail-card bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <img
            src={c.avatar}
            alt={c.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-green-500/60/30 shrink-0"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
              {c.name}
            </h2>
            <p className="text-base text-gray-500 mt-0.5">{c.title}</p>
            <div className="mt-3 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-5">
              <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-green-500/60 shrink-0" />
                {c.email}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-green-500/60 shrink-0" />
                {c.phone}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-green-500/60 shrink-0" />
                {c.address}
              </span>
            </div>
          </div>
          <StatusBadge status={c.status} />
        </div>
      </div>

      <div className="detail-card bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">About Me</h3>
        <p className="text-base text-gray-600 leading-relaxed">{c.about}</p>
      </div>

      <div className="detail-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoCard icon={Briefcase} title="Experience">
          <p className="text-xl font-semibold text-gray-900">
            {c.experience.years}
          </p>
          <p className="text-sm text-gray-500">{c.experience.role}</p>
        </InfoCard>
        <InfoCard icon={Languages} title="Languages">
          <div className="flex flex-wrap gap-2">
            {c.languages.map((l) => (
              <span
                key={l}
                className="px-3 py-1 text-sm rounded-full border border-gray-200 text-gray-700 bg-gray-50"
              >
                {l}
              </span>
            ))}
          </div>
        </InfoCard>
        <InfoCard icon={MapPin} title="Location">
          <p className="text-base font-medium text-gray-900">
            {c.location.place}
          </p>
          <p className="text-sm text-gray-500">{c.location.note}</p>
        </InfoCard>
      </div>

      <div className="detail-card bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#FCF7E7]">
            <Award size={18} className="text-green-500/60" />
          </span>
          <h3 className="text-base font-semibold text-gray-800">
            Areas of Expertise
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {c.expertise.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full border border-green-500/60/40 text-green-500/60 bg-[#FCF7E7]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="detail-card bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#FCF7E7]">
            <Clock size={18} className="text-green-500/60" />
          </span>
          <h3 className="text-base font-semibold text-gray-800">
            Availability
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {c.availability.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#05bc27] shrink-0" />
                <span className="text-base text-gray-700">{a.days}</span>
              </div>
              <span className="text-sm font-medium text-gray-500">
                {a.hours}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-card">
        <AdminVerificationPanel consultant={c} />
      </div>
    </div>
  );
}

export default ConsultantDetail;
