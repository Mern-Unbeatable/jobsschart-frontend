import { baseApi } from '../baseApi';

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query({
      query: (params) => ({
        url: '/sessions/admin/all',
        method: 'GET',
        params,
      }),
      providesTags: ['Session'],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetSessionsQuery,
} = sessionApi;
