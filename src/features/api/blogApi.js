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
  }),
});

export const {
  useGetAllBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = blogApi;
