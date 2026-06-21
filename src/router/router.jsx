import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import AdminLayout from "../components/layout/admin/Layout";
import UserLayout from "../components/layout/user/Layout";
import ConsultantLayout from "../components/layout/consultant/Layout";
import { ROUTES, getDashboardRoute } from "../config";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "../features/slices/authSlice";

// Derive a relative segment from an absolute route path
const seg = (route, basePath) => {
  const prefix = `${basePath}/`;
  return route.startsWith(prefix) ? route.slice(prefix.length) : route;
};

// Lazy imports (your existing imports remain the same)
const Home = lazy(() => import("../pages/home/Home"));
const About = lazy(() => import("../pages/About"));
const Entrepreneurship = lazy(
  () => import("../pages/entrepreneurship/Entrepreneurship"),
);
const Community = lazy(() => import("../pages/community/Community"));
const Services = lazy(() => import("../pages/Services"));
const Consultants = lazy(() => import("../pages/consultants/Consultants"));
const ConsultantDetail = lazy(
  () => import("../pages/consultants/ConsultantDetail"),
);
const ConsultantChatPage = lazy(
  () => import("../pages/consultants/UserChatPage"),
);
const Credit = lazy(() => import("../pages/credit/Credit"));
const Webshop = lazy(() => import("../pages/webshop/Webshop"));
const ProductDetail = lazy(() => import("../pages/webshop/ProductDetail"));
const Checkout = lazy(() => import("../pages/webshop/Checkout"));
const Donation = lazy(() => import("../pages/donation/Donation"));
const BlogPage = lazy(() => import("../pages/blog/Blog"));
const FaqPage = lazy(() => import("../pages/FAQ"));
const BlogDetail = lazy(() => import("../pages/blog/BlogDetail"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/auth/regester/Regester"));
const TermsConditions = lazy(() => import("../pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("../pages/CookiePolicy"));
const Contact = lazy(() => import("../pages/Contact"));

// Admin pages
const Dashboard = lazy(() => import("../pages/dashboard/admin/dashboard/Dashboard"));
const Emails = lazy(() => import("../pages/dashboard/admin/Emails"));
const Leads = lazy(() => import("../pages/dashboard/admin/Leads"));
const Orders = lazy(() => import("../pages/dashboard/admin/order/Orders"));
const MarketplaceOrders = lazy(
  () => import("../pages/dashboard/admin/MarketplaceOrders"),
);
const CaseStudies = lazy(() => import("../pages/dashboard/admin/CaseStudies"));
const Blog = lazy(() => import("../pages/dashboard/admin/blog/Blog"));
const Jobs = lazy(() => import("../pages/dashboard/admin/Jobs"));
const Pricing = lazy(() => import("../pages/dashboard/admin/Pricing"));
const AdminConsultants = lazy(
  () => import("../pages/dashboard/admin/consultants/Consultants"),
);
const AdminUsers = lazy(() => import("../pages/dashboard/admin/user/Users"));
const AdminWebshop = lazy(
  () => import("../pages/dashboard/admin/webshop/Webshop"),
);
const AdminAddNewProduct = lazy(
  () => import("../pages/dashboard/admin/webshop/AddNewProduct"),
);
const AdminProductView = lazy(
  () => import("../pages/dashboard/admin/webshop/ProductView"),
);
const AdminDonation = lazy(
  () => import("../pages/dashboard/admin/donation/Donation"),
);
const AdminAds = lazy(
  () => import("../pages/dashboard/admin/adsManagement/AdsManagement"),
);
const AdminAdsPublished = lazy(
  () => import("../pages/dashboard/admin/adsManagement/PublishedAds"),
);
const AdminSession = lazy(
  () => import("../pages/dashboard/admin/session/Session"),
);
const AdminPayout = lazy(
  () => import("../pages/dashboard/admin/payout/Payout"),
);
const AdminSettings = lazy(
  () => import("../pages/dashboard/admin/settings/Settings"),
);
const AdminProfile = lazy(() => import("../pages/dashboard/admin/Profile"));
const AdminFaq = lazy(() => import("../pages/dashboard/admin/faq/Faq"));

// User pages
const UserDashboard = lazy(() => import("../pages/dashboard/user/Dashboard"));
const UserBookedSchedule = lazy(
  () => import("../pages/dashboard/user/BookedSchedule"),
);
const UserChat = lazy(() => import("../pages/dashboard/user/Chat"));
const UserProfile = lazy(() => import("../pages/dashboard/user/Profile"));
const UserOrders = lazy(() => import("../pages/dashboard/user/orders/Orders"));
const UserSettings = lazy(() => import("../pages/dashboard/user/Settings"));

// Consultant pages
const ConsultantDashboard = lazy(
  () => import("../pages/dashboard/consultant/dashboard/Dashboard"),
);
const ConsultantSchedule = lazy(
  () => import("../pages/dashboard/consultant/Schedule"),
);
const ConsultantSessionsHistory = lazy(
  () => import("../pages/dashboard/consultant/sessionsHistory/SessionsHistory"),
);
const UserChatPage = lazy(() => import("../pages/dashboard/consultant/Chat"));
const ConsultantProfile = lazy(
  () => import("../pages/dashboard/consultant/profile/Profile"),
);
const ConsultantSupportTickets = lazy(
  () => import("../pages/dashboard/consultant/SupportTickets"),
);
const ConsultantBookings = lazy(
  () => import("../pages/dashboard/consultant/Bookings"),
);
const ConsultantEarnings = lazy(
  () => import("../pages/dashboard/consultant/earnings/Earnings"),
);
const ConsultantPayout = lazy(
  () => import("../pages/dashboard/consultant/payout/Payout"),
);
const ConsultantSettings = lazy(
  () => import("../pages/dashboard/consultant/Settings"),
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
    <h1 className="text-6xl font-bold text-gray-800">404</h1>
    <p className="text-xl text-gray-500">Page not found</p>
    <a
      href={ROUTES.HOME}
      className="mt-2 text-blue-600 hover:underline text-sm font-medium"
    >
      Back to Home
    </a>
  </div>
);

// Redirect already-authenticated users away from login to their dashboard
const GuestOnlyRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  if (isAuthenticated) {
    const redirectPath = getDashboardRoute(userRole);
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  return children;
};

// Updated RoleBasedRoute with UPPERCASE roles
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    const redirectPath = getDashboardRoute(userRole);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes */}
      <Route
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout />
          </Suspense>
        }
      >
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.CONSULTANTS} element={<Consultants />} />
        <Route path={ROUTES.ENTREPRENEURSHIP} element={<Entrepreneurship />} />
        <Route path={ROUTES.CONSULTANT_DETAIL} element={<ConsultantDetail />} />
        <Route
          path={ROUTES.CONSULTANT_DETAIL_CHAT}
          element={<ConsultantChatPage />}
        />
        <Route path={ROUTES.CREDIT} element={<Credit />} />
        <Route path={ROUTES.WEBSHOP} element={<Webshop />} />
        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        <Route path={ROUTES.DONATION} element={<Donation />} />
        <Route path={ROUTES.BLOG} element={<BlogPage />} />
        <Route path={ROUTES.FAQ} element={<FaqPage />} />
        <Route path={ROUTES.BLOG_DETAIL} element={<BlogDetail />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.TERMS} element={<TermsConditions />} />
        <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
        <Route path={ROUTES.COOKIES} element={<CookiePolicy />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.SERVICES} element={<Services />} />
        <Route path={ROUTES.COMMUNITY} element={<Community />} />
      </Route>

      {/* Auth routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <Suspense fallback={<PageLoader />}>
            <GuestOnlyRoute>
              <Login />
            </GuestOnlyRoute>
          </Suspense>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <Suspense fallback={<PageLoader />}>
            <GuestOnlyRoute>
              <Register />
            </GuestOnlyRoute>
          </Suspense>
        }
      />

      {/* Admin routes - UPPERCASE */}
      <Route
        path={ROUTES.ADMIN}
        element={
          <Suspense fallback={<PageLoader />}>
            <RoleBasedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </RoleBasedRoute>
          </Suspense>
        }
      >
        <Route
          index
          element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />}
        />
        <Route
          path={seg(ROUTES.ADMIN_DASHBOARD, ROUTES.ADMIN)}
          element={<Dashboard />}
        />
        <Route
          path={seg(ROUTES.ADMIN_EMAILS, ROUTES.ADMIN)}
          element={<Emails />}
        />
        <Route
          path={seg(ROUTES.ADMIN_LEADS, ROUTES.ADMIN)}
          element={<Leads />}
        />
        <Route
          path={seg(ROUTES.ADMIN_ORDERS, ROUTES.ADMIN)}
          element={<Orders />}
        />
        <Route
          path={seg(ROUTES.ADMIN_MARKETPLACE_ORDERS, ROUTES.ADMIN)}
          element={<MarketplaceOrders />}
        />
        <Route
          path={seg(ROUTES.ADMIN_CASE_STUDIES, ROUTES.ADMIN)}
          element={<CaseStudies />}
        />
        <Route path={seg(ROUTES.ADMIN_BLOG, ROUTES.ADMIN)} element={<Blog />} />
        <Route path={seg(ROUTES.ADMIN_JOBS, ROUTES.ADMIN)} element={<Jobs />} />
        <Route
          path={seg(ROUTES.ADMIN_PRICING, ROUTES.ADMIN)}
          element={<Pricing />}
        />
        <Route
          path={seg(ROUTES.ADMIN_CONSULTANTS, ROUTES.ADMIN)}
          element={<AdminConsultants />}
        />
        <Route
          path={seg(ROUTES.ADMIN_USERS, ROUTES.ADMIN)}
          element={<AdminUsers />}
        />
        <Route
          path={seg(ROUTES.ADMIN_WEBSHOP, ROUTES.ADMIN)}
          element={<AdminWebshop />}
        />
        <Route
          path={seg(ROUTES.ADMIN_WEBSHOP_ADD_PRODUCT, ROUTES.ADMIN)}
          element={<AdminAddNewProduct />}
        />
        <Route
          path={seg(ROUTES.ADMIN_WEBSHOP_PRODUCT_VIEW, ROUTES.ADMIN)}
          element={<AdminProductView />}
        />
        <Route
          path={seg(ROUTES.ADMIN_DONATION, ROUTES.ADMIN)}
          element={<AdminDonation />}
        />
        <Route
          path={seg(ROUTES.ADMIN_ADS, ROUTES.ADMIN)}
          element={<AdminAds />}
        />
        <Route
          path={seg(ROUTES.ADMIN_ADS_PUBLISHED, ROUTES.ADMIN)}
          element={<AdminAdsPublished />}
        />
        <Route
          path={seg(ROUTES.ADMIN_SESSION, ROUTES.ADMIN)}
          element={<AdminSession />}
        />
        <Route
          path={seg(ROUTES.ADMIN_PAYOUT, ROUTES.ADMIN)}
          element={<AdminPayout />}
        />
        <Route
          path={seg(ROUTES.ADMIN_SETTINGS, ROUTES.ADMIN)}
          element={<AdminSettings />}
        />
        <Route
          path={seg(ROUTES.ADMIN_PROFILE, ROUTES.ADMIN)}
          element={<AdminProfile />}
        />
        <Route
          path={seg(ROUTES.ADMIN_FAQ, ROUTES.ADMIN)}
          element={<AdminFaq />}
        />
      </Route>

      {/* User routes - UPPERCASE */}
      <Route
        path={ROUTES.USER}
        element={
          <Suspense fallback={<PageLoader />}>
            <RoleBasedRoute allowedRoles={["USER"]}>
              <UserLayout />
            </RoleBasedRoute>
          </Suspense>
        }
      >
        <Route
          index
          element={<Navigate to={ROUTES.USER_DASHBOARD} replace />}
        />
        <Route
          path={seg(ROUTES.USER_DASHBOARD, ROUTES.USER)}
          element={<UserDashboard />}
        />
        <Route
          path={seg(ROUTES.USER_BOOKED_SCHEDULE, ROUTES.USER)}
          element={<UserBookedSchedule />}
        />
        <Route
          path={seg(ROUTES.USER_CHAT, ROUTES.USER)}
          element={<UserChat />}
        />
        <Route
          path={seg(ROUTES.USER_PROFILE, ROUTES.USER)}
          element={<UserProfile />}
        />
        <Route
          path={seg(ROUTES.USER_ORDERS, ROUTES.USER)}
          element={<UserOrders />}
        />
        <Route
          path={seg(ROUTES.USER_SETTINGS, ROUTES.USER)}
          element={<UserSettings />}
        />
      </Route>

      {/* Consultant routes - UPPERCASE */}
      <Route
        path={ROUTES.CONSULTANT}
        element={
          <Suspense fallback={<PageLoader />}>
            <RoleBasedRoute allowedRoles={["CONSULTANT"]}>
              <ConsultantLayout />
            </RoleBasedRoute>
          </Suspense>
        }
      >
        <Route
          index
          element={<Navigate to={ROUTES.CONSULTANT_DASHBOARD} replace />}
        />
        <Route
          path={seg(ROUTES.CONSULTANT_DASHBOARD, ROUTES.CONSULTANT)}
          element={<ConsultantDashboard />}
        />
        <Route
          path={seg(ROUTES.CONSULTANT_SCHEDULE, ROUTES.CONSULTANT)}
          element={<ConsultantSchedule />}
        />
        <Route
          path={seg(ROUTES.CONSULTANT_SESSIONS_HISTORY, ROUTES.CONSULTANT)}
          element={<ConsultantSessionsHistory />}
        />
        <Route
          path={seg(ROUTES.CONSULTANT_CHAT, ROUTES.CONSULTANT)}
          element={<UserChatPage />}
        />
        <Route
          path={seg(ROUTES.CONSULTANT_SUPPORT_TICKETS, ROUTES.CONSULTANT)}
          element={<ConsultantSupportTickets />}
        />
        <Route
          path={seg(ROUTES.CONSULTANT_PROFILE, ROUTES.CONSULTANT)}
          element={<ConsultantProfile />}
        />
        <Route
          path={seg(ROUTES.CONSULTANT_BOOKINGS, ROUTES.CONSULTANT)}
          element={<ConsultantBookings />}
        />
        <Route
          path={seg(ROUTES.CONSULTANT_EARNINGS, ROUTES.CONSULTANT)}
          element={<ConsultantEarnings />}
        />
        <Route
          path={seg(ROUTES.CONSULTANT_PAYOUT, ROUTES.CONSULTANT)}
          element={<ConsultantPayout />}
        />
        <Route
          path={seg(ROUTES.CONSULTANT_SETTINGS, ROUTES.CONSULTANT)}
          element={<ConsultantSettings />}
        />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </>,
  ),
);

export default router;
