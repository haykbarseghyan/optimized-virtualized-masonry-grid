import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import IndexedDbService from '../../../services/IndexedDb'; // Import the IndexedDB service
import { GridItemContainer } from '../Grid.styled';
import { GridImage } from '../types';

const dbService = new IndexedDbService('PhotoDB', 'photos');

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
      // Check IndexedDB for the image blob
      const fetchAndStoreImage = async () => {
        try {
          const existingBlob = await dbService.getBlob(image.id.toString());

          if (existingBlob) {
            // Use the blob if it exists in IndexedDB
            const blobUrl = URL.createObjectURL(existingBlob);
            setImageBlobUrl(blobUrl);
          } else {
            // Fetch the image, save it as a blob, and store it in IndexedDB
            const response = await fetch(image.src.large);
            const blob = await response.blob();
            await dbService.addBlob(image.id.toString(), blob);
            const blobUrl = URL.createObjectURL(blob);
            setImageBlobUrl(blobUrl);
          }
        } catch (error) {
          console.error(
            `Error fetching or storing the image with id ${image.id}:`,
            error,
          );
        }
      };

      fetchAndStoreImage();
    }
  }, [image.src.large, image.id]);

  useEffect(() => {
    // Cleanup blob URL to prevent memory leaks
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
          <img src={imageBlobUrl} alt={image.alt || 'Photo'} loading="lazy" />
        </Link>
      )}
    </GridItemContainer>
  );
};

export default GridItem;
