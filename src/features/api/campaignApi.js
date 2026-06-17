import { baseApi } from '../baseApi';

export const campaignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: (params) => ({
        url: '/ad-campaigns/admin/all',
        method: 'GET',
        params,
      }),
      providesTags: ['Campaign'],
      transformResponse: (response) => response.data,
    }),

    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `/ad-campaigns/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Campaign'],
      transformResponse: (response) => response.data,
    }),
    approveCampaign: builder.mutation({
      query: ({ id, placements }) => ({
        url: `/ad-campaigns/admin/${id}/approve`,
        method: 'POST',
        body: { placements },
      }),
      invalidatesTags: ['Campaign'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useDeleteCampaignMutation,
  useApproveCampaignMutation,
} = campaignApi;
