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
    bookSchedule: builder.mutation({
      query: (data) => ({
        url: '/schedule/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/schedule/bookings/${bookingId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetMyBookingsQuery,
  useGetUpcomingBookingsQuery,
  useBookScheduleMutation,
  useCancelBookingMutation,
} = scheduleApi;
