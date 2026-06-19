import { baseApi } from '../baseApi';

export const payoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayouts: builder.query({
      query: (params) => ({
        url: '/payouts/admin/all',
        method: 'GET',
        params,
      }),
      providesTags: ['Payout'],
      transformResponse: (response) => response.data,
    }),

    getPayoutBalance: builder.query({
      query: () => ({
        url: '/payouts/balance',
        method: 'GET',
      }),
      providesTags: ['Payout'],
      transformResponse: (response) => response.data,
    }),

    getMyPayouts: builder.query({
      query: (params) => ({
        url: '/payouts/my-payouts',
        method: 'GET',
        params,
      }),
      providesTags: ['Payout'],
      transformResponse: (response) => response.data,
    }),


    requestPayout: builder.mutation({
      query: (body) => ({
        url: '/payouts/request',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payout'],
      transformResponse: (response) => response.data,
    }),

    approvePayout: builder.mutation({
      query: ({ id, adminNote }) => ({
        url: `/payouts/admin/${id}/approve`,
        method: 'POST',
        body: adminNote ? { adminNote } : {},
      }),
      invalidatesTags: ['Payout'],
      transformResponse: (response) => response.data,
    }),

    rejectPayout: builder.mutation({
      query: ({ id, rejectReason }) => ({
        url: `/payouts/admin/${id}/reject`,
        method: 'POST',
        body: { rejectReason },
      }),
      invalidatesTags: ['Payout'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetPayoutsQuery,
  useGetPayoutBalanceQuery,
  useGetMyPayoutsQuery,
  useApprovePayoutMutation,
  useRejectPayoutMutation,
  useRequestPayoutMutation,
} = payoutApi;


