import { photoApi } from './photos/photosApi';

const reducers = {
  [photoApi.reducerPath]: photoApi.reducer,
};

export default reducers;
