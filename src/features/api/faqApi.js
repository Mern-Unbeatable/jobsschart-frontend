import { baseApi } from '../baseApi';

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query({
      query: (params = {}) => ({
        url: '/faqs',
        method: 'GET',
        params,
      }),
      providesTags: ['Faq'],
      transformResponse: (response) => response.data,
    }),

    createFaq: builder.mutation({
      query: (data) => ({
        url: '/faqs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Faq'],
      transformResponse: (response) => response.data,
    }),

    updateFaq: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/faqs/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Faq', id },
        'Faq',
      ],
      transformResponse: (response) => response.data,
    }),

    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faq'],
      transformResponse: (response) => response.data,
    }),

    createCommunityQuestion: builder.mutation({
      query: (data) => ({
        url: '/community-questions',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useCreateCommunityQuestionMutation,
} = faqApi;
