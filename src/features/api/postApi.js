import { baseApi } from '../baseApi';

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (params = {}) => ({
        url: '/post',
        method: 'GET',
        params,
      }),
      providesTags: ['Posts'],
      transformResponse: (response) => response.data,
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: '/post',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Posts'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetPostsQuery, useCreatePostMutation } = postApi;
