import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import IndexedDbService from '../../services/IndexedDb';
import { GridImage } from '../Grid/types';

const dbService = new IndexedDbService<GridImage>('PhotoDB', 'photos');

const PhotoView = () => {
  const { id } = useParams();

  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const getStoreImage = async () => {
        try {
          const existingBlob = await dbService.getItem(id);

          if (existingBlob && existingBlob.src.blob) {
            // Use the blob if it exists in IndexedDB
            const blobUrl = URL.createObjectURL(existingBlob.src.blob);
            setImageBlobUrl(blobUrl);
          }
        } catch (error) {
          console.error(
            `Error fetching or storing the image with id ${id}:`,
            error,
          );
        }
      };

      getStoreImage();
    }
  }, [id]);

  return (
    <div>
      {imageBlobUrl && <img src={imageBlobUrl} alt={'Photo'} loading="lazy" />}
    </div>
  );
};

export default PhotoView;
