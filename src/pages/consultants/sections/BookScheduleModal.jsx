import React, { memo, useState, useMemo, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBookScheduleMutation } from '../../../features/api/scheduleApi';
import {
  useGetConsultantWeeklyAvailabilityQuery,
  useGetConsultantDateAvailabilityQuery,
} from '../../../features/api/consultantApi';

const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const BookScheduleModal = memo(({ isOpen, onClose, consultant }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const consultantId = consultant?.consultantId || consultant?.id;
  const bookingDate = useMemo(() => {
    if (!selectedDate) return null;
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [selectedDate, currentMonth]);

  const [bookSchedule, { isLoading: isBooking }] = useBookScheduleMutation();

  const { data: weeklyAvailability, isLoading: isLoadingWeekly } =
    useGetConsultantWeeklyAvailabilityQuery(consultantId, {
      skip: !isOpen || !consultantId,
    });

  const { data: dateAvailability, isFetching: isLoadingDateSlots } =
    useGetConsultantDateAvailabilityQuery(
      { id: consultantId, date: bookingDate },
      { skip: !isOpen || !consultantId || !bookingDate },
    );

  const weeklySlots = useMemo(() => {
    const fromApi =
      weeklyAvailability?.weeklySlots ||
      weeklyAvailability?.allSlots ||
      [];
    if (fromApi.length > 0) return fromApi.filter((s) => s.isActive !== false);
    return (consultant?.availabilitySlots || []).filter((s) => s.isActive !== false);
  }, [weeklyAvailability, consultant?.availabilitySlots]);

  const bookableSlots = dateAvailability?.bookableSlots || [];

  const bookingFee = useMemo(() => {
    if (consultant?.firstNPrice != null) return Number(consultant.firstNPrice);
    return Number(consultant?.pricePerMinute || 2.5);
  }, [consultant?.firstNPrice, consultant?.pricePerMinute]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
      setSelectedSlot(null);
      setCurrentMonth(new Date());
    }
  }, [isOpen]);

  const monthName = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getDayOfWeekName = (year, month, day) => {
    const date = new Date(year, month, day);
    return DAY_NAMES[date.getDay()];
  };

  const hasAvailableSlots = (day) => {
    if (!weeklySlots.length) return false;
    const dayName = getDayOfWeekName(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return weeklySlots.some((slot) => slot.dayOfWeek?.toUpperCase() === dayName);
  };

  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  const formatTime = (timeStr) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  const formatTimeSlot = (startTime, endTime) =>
    `${formatTime(startTime)} - ${formatTime(endTime)}`;

  const renderCalendar = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="text-gray-300 text-center py-2">
          {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i).getDate()}
        </div>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate === day;
      const isAvailable = hasAvailableSlots(day);
      const isPast = isPastDate(day);
      const isDisabled = !isAvailable || isPast;

      days.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={() => {
            setSelectedDate(day);
            setSelectedSlot(null);
          }}
          className={`py-2 rounded-lg font-semibold transition-all relative flex flex-col items-center justify-center ${isSelected
              ? 'bg-[#6E35AE] text-white font-bold'
              : !isDisabled
                ? 'text-[#6E35AE] hover:bg-purple-50 cursor-pointer font-bold'
                : 'text-gray-400 cursor-not-allowed opacity-40'
            }`}
        >
          <span>{day}</span>
          {isAvailable && !isPast && !isSelected && (
            <span className="absolute bottom-1 w-1 h-1 bg-[#6E35AE] rounded-full" />
          )}
        </button>,
      );
    }

    const totalCells = days.length;
    for (let i = 1; totalCells + i <= 35; i++) {
      days.push(
        <div key={`after-${i}`} className="text-gray-300 text-center py-2">
          {i}
        </div>,
      );
    }

    return days;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !consultantId) {
      toast.error('Please select an available date and time slot', { position: 'top-center' });
      return;
    }

    try {
      await bookSchedule({
        consultantId,
        bookingDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      }).unwrap();

      toast.success('Booking confirmed successfully!', { position: 'top-center' });
      onClose();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || 'Failed to book schedule. Please try again.',
        { position: 'top-center' },
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-200 p-4 animate-modal-overlay">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-modal-panel relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10 cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="flex-none pb-4 mb-6 border-b border-gray-100 pr-10">
          <h2 className="text-2xl font-bold text-gray-800">Book A Schedule</h2>
          <p className="text-sm text-gray-500 mt-1">
            with {consultant?.name || consultant?.user?.name || 'Consultant'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 min-h-0 py-2">
          {isLoadingWeekly ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={20} />
              Loading availability…
            </div>
          ) : weeklySlots.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              This consultant has not set their availability yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Available Date</h3>

                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
                      setSelectedDate(null);
                      setSelectedSlot(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <h4 className="text-lg font-semibold text-gray-800">{monthName}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
                      setSelectedDate(null);
                      setSelectedSlot(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['SUN', 'MO', 'TU', 'WED', 'TH', 'FR', 'SA'].map((day) => (
                      <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Available Time</h3>

                {!selectedDate ? (
                  <div className="text-gray-400 text-sm font-medium text-center py-12">
                    Select a marked date from the calendar to view available times.
                  </div>
                ) : isLoadingDateSlots ? (
                  <div className="flex items-center justify-center py-12 text-gray-400">
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Loading times…
                  </div>
                ) : bookableSlots.length === 0 ? (
                  <div className="text-gray-400 text-sm font-medium text-center py-12">
                    No available times for this date. All slots may be booked.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {bookableSlots.map((slot) => {
                      const timeLabel = formatTimeSlot(slot.startTime, slot.endTime);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`w-full px-4 py-3 rounded-lg font-medium text-center transition-all cursor-pointer ${selectedSlot?.id === slot.id
                              ? 'bg-[#E9D5FF] text-gray-900 border-2 border-[#6E35AE]'
                              : 'bg-purple-50/50 text-gray-800 border-2 border-purple-100 hover:border-purple-200'
                            }`}
                        >
                          {timeLabel}
                          {slot.durationMinutes ? (
                            <span className="block text-xs text-gray-500 mt-0.5">
                              {slot.durationMinutes} min
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex-none pt-4 mt-6 border-t border-gray-100">
          <p className="mb-3 text-center text-sm text-gray-500">
            Booking fee: <span className="font-semibold text-[#6E35AE]">€{bookingFee.toFixed(2)}</span>
          </p>
          <button
            type="button"
            onClick={handleBooking}
            disabled={isBooking || !selectedSlot}
            className={`w-full bg-[#6E35AE] hover:bg-[#582791] text-white font-bold py-4 rounded-xl text-lg transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed ${isBooking ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {isBooking ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Booking…
              </>
            ) : (
              'Book Schedule'
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

BookScheduleModal.displayName = 'BookScheduleModal';

export default BookScheduleModal;
