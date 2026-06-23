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
    getComments: builder.query({
      query: (postId) => ({
        url: `/post/${postId}/comments`,
        method: 'GET',
      }),
      providesTags: (result, error, postId) => [{ type: 'PostComments', id: postId }],
      transformResponse: (response) => response.data,
    }),
    createComment: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/post/${postId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'PostComments', id: postId },
        'Posts'
      ],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetPostsQuery, useCreatePostMutation, useGetCommentsQuery, useCreateCommentMutation } = postApi;
