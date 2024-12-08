import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import IndexedDbService from '../../../services/IndexedDb';
import ImageWorker from '../../../services/WebWorker/imageWorker?worker'; // Vite-specific syntax
import { GridItemContainer } from '../Grid.styled';
import { GridImage } from '../types';

const dbService = new IndexedDbService<GridImage>('PhotoDB', 'photos');

interface GridItemProps {
  image: GridImage;
}

const GridItem: React.FC<GridItemProps> = ({ image }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 },
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (image.src.large) {
      const worker = new ImageWorker();

      worker.onmessage = (
        event: MessageEvent<{ success: boolean; blob?: Blob; error?: string }>,
      ) => {
        const { success, blob, error } = event.data;

        if (success && blob) {
          const blobUrl = URL.createObjectURL(blob);
          setImageBlobUrl(blobUrl);

          // Save to IndexedDB asynchronously
          const objectForSaving = JSON.parse(JSON.stringify(image));
          objectForSaving.src.blob = blob;
          dbService.addItem(image.id.toString(), objectForSaving);
        } else {
          console.error('Error loading image:', error);
        }

        // Terminate the worker
        worker.terminate();
      };

      worker.postMessage({ imageSrc: image.src.large });
    }
  }, [image.src.large, image.id, image]);

  useEffect(() => {
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
    };
  }, [imageBlobUrl]);

  return (
    <GridItemContainer
      width={image.scaledWidth}
      height={image.scaledHeight}
      isVisible={isVisible}
      ref={itemRef}
    >
      {isVisible && imageBlobUrl && (
        <Link to={`/photo/${image.id}`}>
          <img src={imageBlobUrl} alt={image.alt || 'Photo'} />
        </Link>
      )}
    </GridItemContainer>
  );
};

export default GridItem;
