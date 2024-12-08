import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

import IndexedDbService from '../../services/IndexedDb';
import { GridImage } from '../Grid/types';

import { Breadcrumbs } from './PhotoView.styled';

const dbService = new IndexedDbService<GridImage>('PhotoDB', 'photos');

const PhotoView = () => {
  const { id } = useParams();

  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const [image, setImage] = useState<GridImage | null>(null);

  useEffect(() => {
    if (id) {
      const getStoreImage = async () => {
        try {
          const existingImage = await dbService.getItem(id);
          console.log(existingImage);
          if (existingImage && existingImage.src.blob) {
            // Use the blob if it exists in IndexedDB
            const blobUrl = URL.createObjectURL(existingImage.src.blob);
            setImageBlobUrl(blobUrl);
            setImage(existingImage);
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
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <Breadcrumbs>
          <ul>
            <li>
              <Link to="/">All photo</Link>
            </li>
            <li>Photo</li>
          </ul>
        </Breadcrumbs>
        <h4>{`Photographer: ${image?.photographer}`}</h4>
        <h5>{`Desicription: ${image?.alt}`}</h5>
      </div>
      {imageBlobUrl && (
        <img src={imageBlobUrl} alt={image?.alt || 'Photo'} loading="lazy" />
      )}
    </>
  );
};

export default PhotoView;
