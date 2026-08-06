import React, { memo } from "react";
import { Calendar, Sparkles, DollarSign } from "lucide-react";
import { useGetActivityStatsQuery } from "../../../../../features/api/activityApi";

const AdminActivitiesStats = memo(() => {
  const { data, isLoading } = useGetActivityStatsQuery();
  const stats = data?.data?.stats || {
    totalEvents: 0,
    totalWorkshops: 0,
    paidSessions: 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-reveal>
      <div className="bg-white p-6 rounded-lg border border-purple-100/50 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-600 tracking-wider">Total Events</p>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats.totalEvents}</h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
          <Calendar size={24} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-purple-100/50 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-600 tracking-wider">Total Workshops</p>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats.totalWorkshops}</h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
          <Sparkles size={24} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-purple-100/50 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-600 tracking-wider">Paid Sessions</p>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{stats.paidSessions}</h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
          <DollarSign size={24} />
        </div>
      </div>
    </div>
  );
});

AdminActivitiesStats.displayName = "AdminActivitiesStats";

export default AdminActivitiesStats;

