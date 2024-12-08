import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useGetPhotosQuery } from '../../store/photos/photosApi';
import { Photo } from '../../store/photos/types';

import GridItem from './components/GridItem';
import Search from './components/Search';
import { getDynamicColumns, masonryGrid } from './utils';

const Grid: React.FC = () => {
  const lock = useRef<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [hasMorePhotos, setHasMorePhotos] = useState<boolean>(true);
  const [columns, setColumns] = useState<number>(3);

  const [searchQuery, setSearchQuery] = useState('star wars');
  const { data, isLoading, isFetching } = useGetPhotosQuery({
    query: searchQuery,
    perPage: 15,
    page,
  });

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const updateColumns = useCallback(() => {
    const screenWidth = window.innerWidth;
    const dynamicColumns = getDynamicColumns(screenWidth, 5, 300);
    setColumns(dynamicColumns);
  }, []);

  useEffect(() => {
    updateColumns(); // init
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [updateColumns]);

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

  // Create the grid structure using the dynamic column count
  const grid = useMemo(
    () => masonryGrid([...new Set(allPhotos)], 300, columns),
    [allPhotos, columns],
  );

  return (
    <div>
      <Search
        callback={(query) => {
          const queryText = query.trim();
          if (queryText) {
            setSearchQuery(queryText);
            setPage(1);
            setAllPhotos([]);
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

        {!isFetching && hasMorePhotos && (
          <div ref={loaderRef} style={{ height: '20px', margin: '20px 0' }} />
        )}
      </div>
    </div>
  );
};

export default Grid;
