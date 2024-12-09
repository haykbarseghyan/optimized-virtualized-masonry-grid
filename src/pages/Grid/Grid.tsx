import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import useUpdateColumn from '../../hooks/useUpdateColumn';
import IndexedDbService from '../../services/IndexedDb';
import { useGetPhotosQuery } from '../../store/photos/photosApi';
import { Photo } from '../../store/photos/types';

import GridItem from './components/GridItem';
import Search from './components/Search';
import { COLUMN_SIZE, PER_PAGE } from './constants';
import { GridImage } from './types';
import { masonryGrid } from './utils';

const dbService = new IndexedDbService<GridImage>('PhotoDB', 'photos');

const Grid = () => {
  const lock = useRef<boolean>(true);
  const hasMorePhotos = useRef<boolean>(true);

  const [page, setPage] = useState<number>(1);

  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem('search') || 'star wars',
  );
  const { columns } = useUpdateColumn();
  const { data, isLoading, isFetching, isError } = useGetPhotosQuery({
    query: searchQuery,
    perPage: PER_PAGE,
    page,
  });

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data?.photos) {
      setAllPhotos((prevPhotos) => {
        const newPhotos = data.photos.filter(
          (photo) => !prevPhotos.some((prevPhoto) => prevPhoto.id === photo.id),
        );
        return [...prevPhotos, ...newPhotos];
      });
      if (data.photos.length === 0) {
        hasMorePhotos.current = false;
      }
    }
  }, [data]);

  const loadMorePhotos = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isFetching && !lock.current) {
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
    if (!hasMorePhotos.current) return;
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
  }, [loadMorePhotos]);

  // Create the grid structure using the dynamic column count
  const grid = useMemo(
    () => masonryGrid(allPhotos, COLUMN_SIZE, columns),
    [allPhotos, columns],
  );

  return (
    <div>
      <Search
        searchQuery={searchQuery}
        callback={(query) => {
          const queryText = query.trim();
          if (queryText) {
            dbService.clearStore();
            setPage(1);
            setAllPhotos([]);
            setSearchQuery(queryText);
            hasMorePhotos.current = true;
            localStorage.setItem('search', queryText);
          }
        }}
      />
      <div style={{ marginTop: '80px' }}>
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

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {isLoading && <p>Loading...</p>}
          {isError && <p>Something went wrong!</p>}
          {data?.photos.length === 0 && (
            <>
              {allPhotos.length === 0 && <p>No photo!</p>}
              {allPhotos.length > 0 && <p>No more photo!</p>}
            </>
          )}
        </div>

        {!isFetching && hasMorePhotos.current && (
          <div ref={loaderRef} style={{ height: '20px', margin: '20px 0' }} />
        )}
      </div>
    </div>
  );
};

export default Grid;
