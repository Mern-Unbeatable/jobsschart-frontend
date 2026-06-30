// features/api/baseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tagList } from './tagList';

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  'http://api.illorac.nl/api/v1';


const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState, extra }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    // Do NOT set Content-Type here — for FormData the browser must set it
    // automatically so it includes the correct multipart boundary.
    // For non-multipart requests, RTK Query's fetchBaseQuery defaults to
    // application/json when body is a plain object.
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    console.error(' API Error Details:', {
      status: result.error.status,
      data: result.error.data,
      url: args.url,
    });
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: tagList,
  endpoints: () => ({}),
});