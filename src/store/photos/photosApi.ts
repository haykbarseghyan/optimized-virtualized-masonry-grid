import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../configureApi/baseQueryApiSlice';

import { PexelsRequest, PexelsResponse } from './types';

export const photoApi = createApi({
  reducerPath: 'photoApi',
  baseQuery,
  endpoints: (builder) => ({
    getPhotos: builder.query<PexelsResponse, PexelsRequest>({
      query: ({ page, perPage, query }) => ({
        url: `/search/?page=${page}&per_page=${perPage}&query=${query}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetPhotosQuery } = photoApi;
