import { baseApi } from '../baseApi';

export const paymentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ========== PROTECTED ROUTES (Requires authentication) ==========
    createCheckout: builder.mutation({
      query: (data) => ({
        url: '/payments/checkout',
        method: 'POST',
        body: data,
        // Don't set Content-Type header - let browser set it for FormData
        // Or use headers only for JSON
      }),
      invalidatesTags: ['Payment', 'PaymentHistory'],
      transformResponse: (response) => response.data,
    }),

    verifyPayment: builder.query({
      query: ({ session_id }) => ({
        url: '/payments/verify',
        method: 'GET',
        params: { session_id },
      }),
      providesTags: (result, error, { session_id }) => [{ type: 'Payment', id: session_id }],
      transformResponse: (response) => response.data,
    }),

    getPaymentHistory: builder.query({
      query: ({ page = 1, limit = 10, status } = {}) => ({
        url: '/payments/history',
        method: 'GET',
        params: { page, limit, status },
      }),
      providesTags: ['PaymentHistory'],
      transformResponse: (response) => response.data,
    }),

    getPaymentMethods: builder.query({
      query: ({ amount = 10 } = {}) => ({
        url: '/payments/methods',
        method: 'GET',
        params: { amount },
      }),
      transformResponse: (response) => response.data,
    }),

    // ========== ADMIN ROUTES ==========
    getAllPayments: builder.query({
      query: ({ page = 1, limit = 10, status, startDate, endDate } = {}) => ({
        url: '/payments/admin/all',
        method: 'GET',
        params: { page, limit, status, startDate, endDate },
      }),
      providesTags: ['AllPayments'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useCreateCheckoutMutation,
  useVerifyPaymentQuery,
  useLazyVerifyPaymentQuery,
  useGetPaymentHistoryQuery,
  useGetAllPaymentsQuery,
  useGetPaymentMethodsQuery,
} = paymentApi;