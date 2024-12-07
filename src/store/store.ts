import { configureStore } from '@reduxjs/toolkit';

import middlewares from './middlewares.ts';
import reducers from './reducers.ts';

export const store = configureStore({
  reducer: reducers,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
