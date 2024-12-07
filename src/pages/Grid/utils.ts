import { Photo } from '../../store/photos/types';

import { MasonryColumn } from './types';

export const masonryGrid = (
  images: Photo[],
  columnWidth: number = 300,
  numColumns: number = 3,
): MasonryColumn[] => {
  const columns: MasonryColumn[] = Array(numColumns)
    .fill(null)
    .map(() => []);
  const columnHeights: number[] = Array(numColumns).fill(0);

  images.forEach((image) => {
    const scaledHeight = (image.height / image.width) * columnWidth;

    let shortestColumnIndex = 0;
    let shortestHeight = columnHeights[0];

    for (let i = 1; i < numColumns; i++) {
      if (columnHeights[i] < shortestHeight) {
        shortestColumnIndex = i;
        shortestHeight = columnHeights[i];
      }
    }

    columns[shortestColumnIndex].push({
      id: image.id,
      scaledWidth: columnWidth,
      scaledHeight,
      src: image.src,
      alt: image.alt,
    });

    columnHeights[shortestColumnIndex] += scaledHeight;
  });

  return columns;
};
