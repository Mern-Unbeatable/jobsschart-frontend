import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, Video, Calendar, Users } from 'lucide-react';
import { ROUTES } from '../../config';

const SERVICES = [
  {
    icon: MessageSquare,
    title: 'Live Chat Consultations',
    description: 'Connect instantly with verified consultants through secure real-time chat sessions.',
  },
  {
    icon: Phone,
    title: 'Voice Calls',
    description: 'Speak directly with your consultant via high-quality audio calls.',
  },
  {
    icon: Video,
    title: 'Video Sessions',
    description: 'Face-to-face video consultations for a more personal experience.',
  },
  {
    icon: Calendar,
    title: 'Appointment Booking',
    description: 'Schedule sessions in advance at times that work for you.',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join our community, ask questions, and access answered guidance from experts.',
  },
];

const ServicesContent = memo(() => {
  return (
    <div className="min-h-screen bg-[#FBFDFF] py-14 md:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Illorac offers a range of spiritual and personal guidance services delivered by carefully verified consultants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SERVICES.map((service) => (
            <div key={service.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#F5F1FD] flex items-center justify-center mb-4">
                <service.icon size={24} className="text-[#6E35AE]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to={ROUTES.CONSULTANTS} className="bg-[#6E35AE] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5A2A8A] transition-colors">
            Browse Consultants
          </Link>
          <Link to={ROUTES.COMMUNITY} className="border border-[#6E35AE] text-[#6E35AE] px-6 py-3 rounded-lg font-semibold hover:bg-[#F5F1FD] transition-colors">
            Visit Community
          </Link>
        </div>
      </div>
    </div>
  );
});

ServicesContent.displayName = 'ServicesContent';

export default ServicesContent;
