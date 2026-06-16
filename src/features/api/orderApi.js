import { baseApi } from '../baseApi';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query({
      query: (params = {}) => ({
        url: '/orders/admin/all',
        method: 'GET',
        params,
      }),
      providesTags: ['Order'],
      transformResponse: (response) => response.data,
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/admin/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
