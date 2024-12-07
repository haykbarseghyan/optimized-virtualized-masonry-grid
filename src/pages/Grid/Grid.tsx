import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useGetPhotosQuery } from '../../store/photos/photosApi';
import { Photo } from '../../store/photos/types';

import GridItem from './components/GridItem';
import { masonryGrid } from './utils';

const Grid = () => {
  const lock = useRef<boolean>(true);
  const [page, setPage] = useState(1);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [hasMorePhotos, setHasMorePhotos] = useState(true);
  const { data, isLoading, isFetching } = useGetPhotosQuery({
    query: 'nature',
    perPage: 15,
    page,
  });
  console.log('data', data);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.photos) {
      setAllPhotos((prevPhotos) => [...prevPhotos, ...data.photos]);
      if (data.photos.length === 0) {
        setHasMorePhotos(false);
      }
    }
  }, [data]);

  const loadMorePhotos = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isFetching && !lock.current) {
        console.log('Loading more photos...');
        setPage((prevPage) => prevPage + 1);
        lock.current = true;
        setTimeout(() => {
          lock.current = false;
        }, 100);
      }
    },
    [isFetching],
  );

  useEffect(() => {
    setTimeout(() => {
      lock.current = false;
    }, 100);
  }, []);

  useEffect(() => {
    if (!hasMorePhotos) return;
    const observer = new IntersectionObserver(loadMorePhotos, {
      threshold: 1.0,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMorePhotos, hasMorePhotos]);

  // TODO fix
  const grid = useMemo(
    () => masonryGrid([...new Set(allPhotos)], 300, 3),
    [allPhotos],
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        {grid.map((column, columnIndex) => (
          <div
            key={columnIndex}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            {column.map((image) => (
              <GridItem key={image.id} image={image} />
            ))}
          </div>
        ))}
      </div>

      {isLoading && <p>Loading...</p>}

      {!isFetching && hasMorePhotos && (
        <div ref={loaderRef} style={{ height: '20px', margin: '20px 0' }} />
      )}
    </div>
  );
};

export default Grid;
