import { baseApi } from '../baseApi';

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogCategories: builder.query({
      query: () => ({
        url: '/blogs/categories',
        method: 'GET',
      }),
      providesTags: ['BlogCategory'],
      transformResponse: (response) => response.data,
    }),

    createBlogCategory: builder.mutation({
      query: (data) => ({
        url: '/blogs/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BlogCategory'],
      transformResponse: (response) => response.data,
    }),

    deleteBlogCategory: builder.mutation({
      query: (id) => ({
        url: `/blogs/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BlogCategory'],
      transformResponse: (response) => response.data,
    }),

    getBlogs: builder.query({
      query: (params = {}) => ({
        url: '/blogs',
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
      transformResponse: (response) => response.data,
    }),

    createBlog: builder.mutation({
      query: (data) => ({
        url: '/blogs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
      transformResponse: (response) => response.data,
    }),

    updateBlog: builder.mutation({
      query: ({ id, body }) => ({
        url: `/blogs/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Blog'],
      transformResponse: (response) => response.data,
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
      transformResponse: (response) => response.data,
    }),

    getDraftBlogs: builder.query({
      query: (params = {}) => ({
        url: '/blogs/admin/drafts',
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
      transformResponse: (response) => response.data,
    }),

    getBlogBySlug: builder.query({
      query: (slug) => ({
        url: `/blogs/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAllBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  useGetBlogsQuery,
  useGetDraftBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogBySlugQuery,
} = blogApi;
