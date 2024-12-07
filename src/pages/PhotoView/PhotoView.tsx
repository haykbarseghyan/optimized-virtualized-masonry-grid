import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import IndexedDbService from '../../services/IndexedDb';

const dbService = new IndexedDbService('PhotoDB', 'photos');

const PhotoView = () => {
  const { id } = useParams();

  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const getStoreImage = async () => {
        try {
          const existingBlob = await dbService.getBlob(id);

          if (existingBlob) {
            // Use the blob if it exists in IndexedDB
            const blobUrl = URL.createObjectURL(existingBlob);
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
