import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { ROUTES } from "../config";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <>
      <footer className="bg-[#545454] text-[#E5E7EB] pt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
        {/* Section 1: Logo & Socials */}
        <div className="flex flex-col items-start gap-2">
          <img
            src="/logo.png"
            alt={t("footer.logoAlt")}
            className="h-20 w-auto object-contain "
          />
          <div className="text-base leading-relaxed max-w-70">
            {t("footer.copyright")}
            <br />
            {t("footer.taxAndReviews")}
          </div>
          {/* Lucide Icons used here */}
          <div className="flex gap-4 items-center">
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:text-[#545454] transition-all"
            >
              <Facebook size={18} strokeWidth={1.5} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:text-[#545454] transition-all"
            >
              <Instagram size={18} strokeWidth={1.5} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:text-[#545454] transition-all"
            >
              <Youtube size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Section 2: Klantenservice */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6">
            {t("footer.customerService.title")}
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <Link
                to={ROUTES.TERMS}
                className="hover:text-white transition-colors"
              >
                {t("footer.customerService.links.terms")}
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.PRIVACY}
                className="hover:text-white transition-colors"
              >
                {t("footer.customerService.links.privacy")}
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.COOKIES}
                className="hover:text-white transition-colors"
              >
                {t("footer.customerService.links.cookies")}
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.CONTACT}
                className="hover:text-white transition-colors"
              >
                {t("footer.customerService.links.contact")}
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.FAQ}
                className="hover:text-white transition-colors"
              >
                {t("footer.customerService.links.faq")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Information */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6">
            {t("footer.information.title")}
          </h3>
          <div className="text-sm leading-relaxed space-y-1 font-medium">
            <p>{t("footer.information.line1")}</p>
            <p>{t("footer.information.line2")}</p>
            <p>{t("footer.information.address1")}</p>
            <p>{t("footer.information.address2")}</p>
            <p className="pt-2">{t("footer.information.email")}</p>
          </div>
        </div>
        {/* Section 4: Map Section */}
        <div className="flex justify-start lg:justify-end">
          <div className="relative w-full max-w-70 h-44 rounded-xl overflow-hidden shadow-2xl border border-white/20 group">
            {/* Interactive Embed Map */}
            <iframe
              src="https://maps.google.com/maps?q=Wijnstraat%2075,%203311BT%20Dordrecht&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              title="Location Map"
            ></iframe>

            {/* Action Button */}
            <div className="absolute top-3 left-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Wijnstraat+75,+3311BT+Dordrecht"
                target="_blank"
                rel="noreferrer"
                className="bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg hover:bg-white hover:scale-105 active:scale-95 transition-all"
              >
                <span>{t("footer.map.openInMaps")}</span>
                <ExternalLink size={12} className="text-purple-600" />
              </a>
            </div>

            {/* Bottom Address Badge */}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-white/80 backdrop-blur-md p-2 rounded-lg border border-white/50">
                <p className="text-[10px] text-gray-800 font-medium truncate">
                  {t("footer.map.location")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </footer>

      {/* Bottom Bar: Gold/Yellow Color */}
      <div className="bg-[#E9D5FF] text-gray-600 py-4 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-base font-medium">
          <span>{t("footer.bottomBar.copyright")}</span>
          <div className="flex gap-6 items-center">
            <Link
              to={ROUTES.TERMS}
              className="hover:underline underline-offset-4"
            >
              {t("footer.bottomBar.links.terms")}
            </Link>
            <Link
              to={ROUTES.PRIVACY}
              className="hover:underline underline-offset-4"
            >
              {t("footer.bottomBar.links.privacy")}
            </Link>
            <Link
              to={ROUTES.COOKIES}
              className="hover:underline underline-offset-4"
            >
              {t("footer.bottomBar.links.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
