import { baseApi } from '../baseApi';

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyBookings: builder.query({
      query: (params = {}) => ({
        url: '/schedule/my-bookings',
        method: 'GET',
        params,
      }),
      providesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
    getUpcomingBookings: builder.query({
      query: (params = {}) => ({
        url: '/schedule/my-bookings/upcoming',
        method: 'GET',
        params,
      }),
      providesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
    getConsultantBookings: builder.query({
      query: (params = {}) => ({
        url: '/schedule/consultant/bookings',
        method: 'GET',
        params,
      }),
      providesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
    getConsultantUpcomingBookings: builder.query({
      query: (params = {}) => ({
        url: '/schedule/consultant/bookings/upcoming',
        method: 'GET',
        params,
      }),
      providesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
    bookSchedule: builder.mutation({
      query: (data) => ({
        url: '/schedule/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Session', 'Availability'],
      transformResponse: (response) => response.data,
    }),
    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/schedule/bookings/${bookingId}/cancel`,
        method: 'PATCH',
        body: { status: 'CANCELLED' },
      }),
      invalidatesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
    cancelConsultantBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/schedule/consultant/bookings/${bookingId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
    confirmConsultantBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/schedule/consultant/bookings/${bookingId}/confirm`,
        method: 'PATCH',
        body: { status: 'CONFIRMED' },
      }),
      invalidatesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
    completeConsultantBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/schedule/consultant/bookings/${bookingId}/complete`,
        method: 'PATCH',
        body: { status: 'COMPLETED' },
      }),
      invalidatesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetMyBookingsQuery,
  useGetUpcomingBookingsQuery,
  useGetConsultantBookingsQuery,
  useGetConsultantUpcomingBookingsQuery,
  useBookScheduleMutation,
  useCancelBookingMutation,
  useCancelConsultantBookingMutation,
  useConfirmConsultantBookingMutation,
  useCompleteConsultantBookingMutation,
} = scheduleApi;
