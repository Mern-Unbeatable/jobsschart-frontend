import { baseApi } from '../baseApi';

export const topicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTopics: builder.query({
      query: () => ({
        url: '/topics',
        method: 'GET',
      }),
      providesTags: ['Topic'],
      transformResponse: (response) => response.data,
    }),

    createTopic: builder.mutation({
      query: (data) => ({
        url: '/topics',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Topic'],
      transformResponse: (response) => response.data,
    }),

    deleteTopic: builder.mutation({
      query: (id) => ({
        url: `/topics/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Topic'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAllTopicsQuery,
  useCreateTopicMutation,
  useDeleteTopicMutation,
} = topicApi;
