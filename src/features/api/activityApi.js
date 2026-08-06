import { baseApi } from '../baseApi';

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityStats: builder.query({
      query: () => ({
        url: '/activities/stats',
        method: 'GET',
      }),
      providesTags: ['Activity'],
    }),

    getActivities: builder.query({
      query: (params = {}) => ({
        url: '/activities',
        method: 'GET',
        params,
      }),
      providesTags: ['Activity'],
      transformResponse: (response) => response.data,
    }),

    createActivity: builder.mutation({
      query: (data) => ({
        url: '/activities',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Activity'],
      transformResponse: (response) => response.data,
    }),

    updateActivity: builder.mutation({
      query: ({ id, body }) => ({
        url: `/activities/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Activity'],
      transformResponse: (response) => response.data,
    }),

    deleteActivity: builder.mutation({
      query: (id) => ({
        url: `/activities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Activity'],
      transformResponse: (response) => response.data,
    }),

    registerActivity: builder.mutation({
      query: ({ id, body }) => ({
        url: `/activities/${id}/register`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Activity'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetActivityStatsQuery,
  useGetActivitiesQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useRegisterActivityMutation,
} = activityApi;
