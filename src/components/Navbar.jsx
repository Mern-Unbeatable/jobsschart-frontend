import React, { memo, useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { ROUTES, getDashboardRoute } from "../config";
import LanguageSelector from "./LanguageSelector";
import {
  selectIsAuthenticated,
  selectUserRole,
  logoutUser,
} from "../features/slices/authSlice";

const NAV_BEFORE_LINKS = [
  { to: ROUTES.HOME, labelKey: "common.home", end: true },
  { to: ROUTES.CONSULTANTS, labelKey: "common.consultants" },
  { to: ROUTES.CREDIT, labelKey: "common.credit" },
  { to: ROUTES.DONATION, labelKey: "common.donation" },
  { to: ROUTES.COMMUNITY, labelKey: "common.community" },
];

const NAV_AFTER_LINKS = [{ to: ROUTES.FAQ, labelKey: "common.faq" }];

const ENTREPRENEURSHIP_LINKS = [
  { to: ROUTES.ENTREPRENEURSHIP, labelKey: "common.entrepreneurship" },
  { to: ROUTES.WEBSHOP, labelKey: "common.webshop" },
  { to: ROUTES.BLOG, labelKey: "common.blog" },
];

const navLinkClass = ({ isActive }) =>
  [
    "group relative inline-flex items-center px-2 py-1 text-base font-medium transition-all duration-300 ease-out",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:animate-nav-pop motion-reduce:transform-none motion-reduce:transition-none",
    "after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:rounded-full after:transition-transform after:duration-300 after:content-['']",
    isActive
      ? "text-purple-700 after:scale-x-100 after:bg-purple-700"
      : "text-gray-600 after:scale-x-0 after:bg-purple-300 hover:text-purple-600 hover:after:scale-x-100",
  ].join(" ");

const dropdownItemClass = ({ isActive }) =>
  [
    "block px-4 py-2.5 text-sm font-semibold rounded-md transition-all duration-200",
    isActive
      ? "bg-purple-100 text-[#6E35AE]"
      : "text-gray-700 hover:bg-purple-50 hover:text-[#6E35AE]",
  ].join(" ");

const mobileNavLinkClass = ({ isActive }) =>
  [
    "block px-6 py-4 text-base font-semibold transition-all duration-300 ease-out",
    "active:scale-[0.98] active:animate-nav-pop motion-reduce:transform-none motion-reduce:transition-none",
    isActive
      ? "bg-[#E9D5FF] text-[#6E35AE] shadow-[inset_3px_0_0_0_#7e22ce]"
      : "text-gray-700 hover:bg-gray-50 hover:text-[#6E35AE]",
  ].join(" ");

const mobileSubNavLinkClass = ({ isActive }) =>
  [
    "block pl-12 pr-6 py-3.5 text-base font-semibold transition-all duration-300 ease-out",
    isActive
      ? "bg-[#E9D5FF]/60 text-[#6E35AE] shadow-[inset_3px_0_0_0_#7e22ce]"
      : "text-gray-600 hover:bg-purple-50/20 hover:text-[#6E35AE]",
  ].join(" ");

const Navbar = memo(({ menuOpen, setMenuOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  const location = useLocation();
  const isEntrepreneurshipActive = [
    ROUTES.WEBSHOP,
    ROUTES.BLOG,
    ROUTES.ENTREPRENEURSHIP,
  ].includes(location.pathname);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(
    isEntrepreneurshipActive,
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isEntrepreneurshipActive) {
      setMobileDropdownOpen(true);
    }
  }, [isEntrepreneurshipActive]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoTo = isAuthenticated ? getDashboardRoute(userRole) : ROUTES.HOME;
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const loadingToast = toast.loading("Logging out...");
      await dispatch(logoutUser()).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Signed out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("auth");
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="sticky top-0 z-100 border-b border-gray-100 bg-[#E9D5FF] shadow-sm">
      <div className="relative z-10 w-full container mx-auto px-4 lg:px-6 ">
        <div className="flex h-20 lg:h-30 items-center justify-between">
          <div className="shrink-0">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Netwerkmediums Logo"
                className="h-18 lg:h-28 w-auto object-contain "
              />
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-6">
            {NAV_BEFORE_LINKS.map(({ to, labelKey, end }) => (
              <NavLink
                key={labelKey}
                to={to}
                end={end}
                className={navLinkClass}
              >
                {t(labelKey)}
              </NavLink>
            ))}

            {/* Entrepreneurship Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`group relative inline-flex items-center gap-1 px-2 py-1 text-base font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 cursor-pointer after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:rounded-full after:transition-transform after:duration-300 after:content-[''] ${
                  isEntrepreneurshipActive
                    ? "text-purple-700 after:scale-x-100 after:bg-purple-700"
                    : "text-gray-600 hover:text-purple-600 after:scale-x-0 after:bg-purple-300 hover:after:scale-x-100"
                }`}
              >
                <span>{t("common.entrepreneurship")}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl border border-purple-100 bg-white/95 p-2 shadow-xl backdrop-blur-md transition-all duration-300 ease-out origin-top-right z-50 ${
                  dropdownOpen
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
                }`}
              >
                {ENTREPRENEURSHIP_LINKS.map(({ to, labelKey }) => (
                  <NavLink
                    key={labelKey}
                    to={to}
                    onClick={() => setDropdownOpen(false)}
                    className={dropdownItemClass}
                  >
                    {t(labelKey)}
                  </NavLink>
                ))}
              </div>
            </div>

            {NAV_AFTER_LINKS.map(({ to, labelKey, end }) => (
              <NavLink
                key={labelKey}
                to={to}
                end={end}
                className={navLinkClass}
              >
                {t(labelKey)}
              </NavLink>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-3">
            <LanguageSelector />
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardRoute(userRole)}
                  className="rounded-md bg-[#6E35AE] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all uppercase tracking-wide"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.REGISTER}
                  className="rounded-md bg-white border border-gray-200 px-5 py-2.5 text-sm font-semibold text-[#6E35AE] shadow-sm transition-all hover:bg-gray-50"
                >
                  {t("common.becomeConsultant")}
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className="rounded-md bg-[#6E35AE] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all "
                >
                  {t("common.signIn")}
                </Link>
              </>
            )}
          </div>

          <div className="flex xl:hidden items-center gap-3 ml-auto">
            <LanguageSelector />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              {menuOpen ? (
                <X size={28} className="text-gray-800" />
              ) : (
                <Menu size={28} />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 top-20 z-90 bg-black/30 backdrop-blur-sm xl:hidden"
          onClick={closeMenu}
        >
          <div
            id="mobile-menu"
            className="absolute left-0 top-0 z-100 flex w-full flex-col border-t border-gray-100 bg-[#E9D5FF] shadow-2xl xl:hidden animate-in slide-in-from-top duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="py-1">
              {NAV_BEFORE_LINKS.map(({ to, labelKey, end }) => (
                <NavLink
                  key={labelKey}
                  to={to}
                  end={end}
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  {t(labelKey)}
                </NavLink>
              ))}

              {/* Mobile Collapsible Entrepreneurship */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileDropdownOpen((v) => !v)}
                  className={`flex w-full items-center justify-between px-6 py-4 text-base font-semibold transition-all duration-300 cursor-pointer ${
                    isEntrepreneurshipActive
                      ? "bg-[#E9D5FF] text-[#6E35AE]"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#6E35AE]"
                  }`}
                >
                  <span>{t("common.entrepreneurship")}</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${
                      mobileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileDropdownOpen && (
                  <div className="bg-purple-50/30">
                    {ENTREPRENEURSHIP_LINKS.map(({ to, labelKey }) => (
                      <NavLink
                        key={labelKey}
                        to={to}
                        onClick={closeMenu}
                        className={mobileSubNavLinkClass}
                      >
                        {t(labelKey)}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {NAV_AFTER_LINKS.map(({ to, labelKey, end }) => (
                <NavLink
                  key={labelKey}
                  to={to}
                  end={end}
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  {t(labelKey)}
                </NavLink>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 p-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardRoute(userRole)}
                    onClick={closeMenu}
                    className="w-full rounded-md bg-[#6E35AE] py-4 text-center text-lg font-bold text-white shadow-md uppercase tracking-wide"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={closeMenu}
                    className="w-full rounded-md bg-white border border-gray-200 py-4 text-center text-lg font-bold text-[#6E35AE] shadow-md hover:bg-gray-50 transition-all"
                  >
                    {t("common.becomeConsultant")}
                  </Link>
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={closeMenu}
                    className="w-full rounded-md bg-[#6E35AE] py-4 text-center text-lg font-bold text-white shadow-md"
                  >
                    {t("common.signIn")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
