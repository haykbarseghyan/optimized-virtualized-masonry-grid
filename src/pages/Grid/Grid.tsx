import { useGetPhotosQuery } from '../../store/photos/photosApi';

const Grid = () => {
  const { data } = useGetPhotosQuery({ query: 'nature', perPage: 40, page: 1 });
  console.log(data);
  return <>{data?.photos.map((photo) => <img src={photo.src.small} />)}</>;
};

export default Grid;
