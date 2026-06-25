import React, { memo, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const BookScheduleModal = memo(({ isOpen, onClose, consultant }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const getDayOfWeekName = (date) => {
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    return days[date.getDay()];
  };

  // Helper to check if a day has available slots
  const hasAvailableSlots = (day) => {
    if (!consultant?.availabilitySlots) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayName = getDayOfWeekName(date);
    return consultant.availabilitySlots.some((slot) => slot.dayOfWeek?.toUpperCase() === dayName);
  };

  // Filter available schedules for the selected date
  const availableSchedules = React.useMemo(() => {
    if (!selectedDate || !consultant?.availabilitySlots) return [];
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate);
    const dayName = getDayOfWeekName(date);
    
    return consultant.availabilitySlots.filter(
      (slot) => slot.dayOfWeek?.toUpperCase() === dayName
    );
  }, [selectedDate, currentMonth, consultant?.availabilitySlots]);

  const formatTime = (timeStr) => {
    try {
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeStr;
    }
  };

  const formatTimeSlot = (startTime, endTime) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const renderCalendar = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className='text-gray-300 text-center py-2'>
          {new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            -i,
          ).getDate()}
        </div>,
      );
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate === day;
      const isAvailable = hasAvailableSlots(day);
      
      days.push(
        <button
          key={day}
          disabled={!isAvailable}
          onClick={() => {
            setSelectedDate(day);
            setSelectedTime(null);
            setSelectedSchedule(null);
          }}
          className={`py-2 rounded-lg font-semibold transition-all relative flex flex-col items-center justify-center ${
            isSelected
              ? 'bg-[#6E35AE] text-white font-bold'
              : isAvailable
              ? 'text-[#6E35AE] hover:bg-purple-50 cursor-pointer font-bold'
              : 'text-gray-400 cursor-not-allowed opacity-40'
          }`}
        >
          <span>{day}</span>
          {isAvailable && !isSelected && (
            <span className="absolute bottom-1 w-1 h-1 bg-[#6E35AE] rounded-full" />
          )}
        </button>,
      );
    }

    // Add empty cells for days after month ends
    const totalCells = days.length;
    for (let i = 1; totalCells + i <= 35; i++) {
      days.push(
        <div key={`after-${i}`} className='text-gray-300 text-center py-2'>
          {i}
        </div>,
      );
    }

    return days;
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime && selectedSchedule) {
      toast.success(
        `Booking confirmed for ${consultant?.name || consultant?.user?.name} on ${currentMonth.toLocaleString('default', { month: 'long' })} ${selectedDate}, ${currentMonth.getFullYear()} at ${selectedTime}`,
        { position: 'top-center' },
      );
      setTimeout(() => {
        onClose();
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedSchedule(null);
      }, 1500);
    } else {
      toast.error('Please select an available date and time slot', {
        position: 'top-center',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-200 p-4 animate-modal-overlay'>
      <div className='bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl animate-modal-panel relative'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
        >
          <X size={24} />
        </button>

        <h2 className='text-2xl font-bold text-gray-800 mb-8'>
          Book A Schedule
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Calendar Section */}
          <div>
            <h3 className='text-lg font-bold text-gray-800 mb-4'>
              Available Date
            </h3>

            {/* Month Navigation */}
            <div className='flex items-center justify-between mb-6'>
              <button
                onClick={() => {
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                    ),
                  );
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setSelectedSchedule(null);
                }}
                className='p-2 hover:bg-gray-100 rounded'
              >
                <ChevronLeft size={20} className='text-gray-600' />
              </button>
              <h4 className='text-lg font-semibold text-gray-800'>
                {monthName}
              </h4>
              <button
                onClick={() => {
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                    ),
                  );
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setSelectedSchedule(null);
                }}
                className='p-2 hover:bg-gray-100 rounded'
              >
                <ChevronRight size={20} className='text-gray-600' />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className='bg-gray-50 p-4 rounded-lg'>
              {/* Day Headers */}
              <div className='grid grid-cols-7 gap-2 mb-2'>
                {['SUN', 'MO', 'TU', 'WED', 'TH', 'FR', 'SA'].map((day) => (
                  <div
                    key={day}
                    className='text-center text-xs font-bold text-gray-500 py-2'
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className='grid grid-cols-7 gap-2'>{renderCalendar()}</div>
            </div>
          </div>

          {/* Time Slots Section */}
          <div>
            <h3 className='text-lg font-bold text-gray-800 mb-4'>
              Available Time
            </h3>

            {!selectedDate ? (
              <div className="text-gray-400 text-sm font-medium text-center py-12 font-poppins">
                Select a marked date from the calendar to view available times.
              </div>
            ) : availableSchedules.length === 0 ? (
              <div className="text-gray-400 text-sm font-medium text-center py-12 font-poppins">
                No available times for this date.
              </div>
            ) : (
              <div className='space-y-2 max-h-64 overflow-y-auto pr-1'>
                {availableSchedules.map((schedule) => {
                  const timeLabel = formatTimeSlot(schedule.startTime, schedule.endTime);
                  return (
                    <button
                      key={schedule.id}
                      onClick={() => {
                        setSelectedTime(timeLabel);
                        setSelectedSchedule(schedule);
                      }}
                      className={`w-full px-4 py-3 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        selectedSchedule?.id === schedule.id
                          ? 'bg-[#E9D5FF] text-gray-900 border-2 border-[#6E35AE]'
                          : 'bg-purple-50/50 text-gray-800 border-2 border-purple-100 hover:border-purple-200'
                      }`}
                    >
                      {timeLabel}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Book Schedule Button */}
        <button
          onClick={handleBooking}
          className='w-full bg-[#6E35AE] hover:bg-[#582791] text-white font-bold py-4 rounded-xl mt-8 text-lg transition-all shadow-md active:scale-98 cursor-pointer'
        >
          Book Schedule
        </button>
      </div>
    </div>
  );
});

BookScheduleModal.displayName = 'BookScheduleModal';

export default BookScheduleModal;
