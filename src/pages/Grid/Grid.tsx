import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import IndexedDbService from '../../services/IndexedDb';
import { useGetPhotosQuery } from '../../store/photos/photosApi';
import { Photo } from '../../store/photos/types';

import GridItem from './components/GridItem';
import Search from './components/Search';
import { COLUMN_SIZE, MAX_COLUMN_COUNT, PER_PAGE } from './constants';
import { GridImage } from './types';
import { getDynamicColumns, masonryGrid } from './utils';

const dbService = new IndexedDbService<GridImage>('PhotoDB', 'photos');

const Grid: React.FC = () => {
  const lock = useRef<boolean>(true);
  const hasMorePhotos = useRef<boolean>(true);

  const [page, setPage] = useState<number>(1);

  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  const [columns, setColumns] = useState<number>(3);

  const [searchQuery, setSearchQuery] = useState('star wars');

  const { data, isLoading, isFetching } = useGetPhotosQuery({
    query: searchQuery,
    perPage: PER_PAGE,
    page,
  });

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const updateColumns = useCallback(() => {
    const screenWidth = window.innerWidth;
    const dynamicColumns = getDynamicColumns(
      screenWidth,
      MAX_COLUMN_COUNT,
      COLUMN_SIZE,
    );
    setColumns(dynamicColumns);
  }, []);

  useEffect(() => {
    updateColumns(); // init
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [updateColumns]);

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
        callback={(query) => {
          const queryText = query.trim();
          if (queryText) {
            dbService.clearStore();
            setPage(1);
            setAllPhotos([]);
            setSearchQuery(queryText);
          }
        }}
      />
      <div style={{ marginTop: '40px' }}>
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

        {!isFetching && hasMorePhotos.current && (
          <div ref={loaderRef} style={{ height: '20px', margin: '20px 0' }} />
        )}
      </div>
    </div>
  );
};

export default Grid;
