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
  }),
});

export const {
  useGetMyBookingsQuery,
} = scheduleApi;
