import { baseApi } from '../baseApi';

export const donationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDonations: builder.query({
      query: (params = {}) => ({
        url: '/donations',
        method: 'GET',
        params,
      }),
      providesTags: ['Donation'],
      transformResponse: (response) => response.data,
    }),
    getDonationStats: builder.query({
      query: () => ({
        url: '/donations/stats',
        method: 'GET',
      }),
      providesTags: ['Donation'],
      transformResponse: (response) => response.data,
    }),
    deleteDonation: builder.mutation({
      query: (id) => ({
        url: `/donations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Donation'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetDonationsQuery,
  useGetDonationStatsQuery,
  useDeleteDonationMutation,
} = donationApi;
