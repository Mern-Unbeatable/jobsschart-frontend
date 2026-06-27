import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Compass, Users, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { ROUTES } from "../../config";

const AboutContent = memo(() => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#FAF8FD] min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E9D5FF]/60 via-white to-[#FAF8FD] py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,53,174,0.05),transparent_40%)]" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9D5FF] text-[#6E35AE] text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles size={14} />
            <span>Discover Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-8">
            Empowering Journeys of <span className="text-[#6E35AE]">Wisdom</span> & Growth
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-medium mb-10 max-w-2xl mx-auto">
            We bridge the gap between spiritual guidance, professional advisory, and sustainable success for conscious entrepreneurs worldwide.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 lg:py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Mission Card */}
          <div className="group relative rounded-3xl bg-white p-8 lg:p-12 shadow-md hover:shadow-2xl transition-all duration-300 border border-purple-100/50 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9D5FF]/10 rounded-full blur-3xl group-hover:bg-[#E9D5FF]/20 transition-all duration-300" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#E9D5FF] flex items-center justify-center text-[#6E35AE] mb-8 group-hover:scale-110 transition-transform duration-300">
                <Compass size={28} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                To offer an authentic, secure, and interactive space where individuals can access intuitive advisors, buy credits seamlessly, expand their business acumen, and nurture their spiritual path.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative rounded-3xl bg-white p-8 lg:p-12 shadow-md hover:shadow-2xl transition-all duration-300 border border-purple-100/50 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9D5FF]/10 rounded-full blur-3xl group-hover:bg-[#E9D5FF]/20 transition-all duration-300" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#E9D5FF] flex items-center justify-center text-[#6E35AE] mb-8 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={28} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                To become the premier hub for holistic self-development and digital commerce, creating a harmonious ecosystem where ancient wisdom fuels modern professional growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white py-16 lg:py-24 border-y border-purple-100/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              We hold ourselves to the highest standards of integrity, transparency, and holistic empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl hover:bg-[#FAF8FD] transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#E9D5FF] flex items-center justify-center text-[#6E35AE] mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Authenticity & Trust</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                Every advisor and consultant on our platform is carefully verified to ensure you receive real, trustworthy guidance.
              </p>
            </div>

            <div className="p-6 rounded-2xl hover:bg-[#FAF8FD] transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#E9D5FF] flex items-center justify-center text-[#6E35AE] mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Community First</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                We design features that foster genuine connection, learning, and mutual support across our communities.
              </p>
            </div>

            <div className="p-6 rounded-2xl hover:bg-[#FAF8FD] transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#E9D5FF] flex items-center justify-center text-[#6E35AE] mb-6">
                <Compass size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Holistic Growth</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                We believe that business and spirit are connected. Our resources encourage progress in both domains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#FAF8FD] via-white to-[#E9D5FF]/30">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
            Ready to Explore the Platform?
          </h2>
          <p className="text-gray-600 font-medium mb-10 max-w-xl mx-auto">
            Connect with certified advisors, explore our digital webshop, or join our community discussions today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={ROUTES.CONSULTANTS}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#6E35AE] text-white text-base font-semibold shadow-md hover:bg-[#562590] transition-colors duration-200"
            >
              <span>Meet Advisors</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white border border-purple-200 text-gray-700 text-base font-semibold shadow-sm hover:bg-[#FAF8FD] transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
});

AboutContent.displayName = "AboutContent";

export default AboutContent;
