import { fetchBaseQuery } from '@reduxjs/toolkit/query';

import { API_KEY, API_URI } from '../configs/environment';

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URI,
  prepareHeaders: (headers) => {
    headers.set('Authorization', API_KEY);
    return headers;
  },
});
