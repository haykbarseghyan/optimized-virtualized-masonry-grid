import { photoApi } from './photos/photosApi';

const middlewares = [photoApi.middleware];

export default middlewares;
