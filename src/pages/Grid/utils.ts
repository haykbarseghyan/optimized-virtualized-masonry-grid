import { Photo } from '../../store/photos/types';

import { MasonryColumn } from './types';
/**
 * Distributes images into a masonry grid layout.
 *
 * @param {Photo[]} images - Array of image objects to be arranged.
 * @param {number} [columnWidth=300] - The width of each column in the grid.
 * @param {number} [numColumns=3] - Number of columns in the grid.
 * @returns {MasonryColumn[]} - Array of columns, each containing images arranged in a masonry layout.
 */
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
      photographer: image.photographer,
    });

    columnHeights[shortestColumnIndex] += scaledHeight;
  });

  return columns;
};

/**
 * Calculates the number of columns dynamically based on screen width.
 *
 * @param {number} screenWidth - The current width of the screen in pixels.
 * @param {number} [maxColumns=5] - The maximum number of columns allowed.
 * @param {number} [baseWidth=300] - The base width of each column.
 * @returns {number} - The calculated number of columns, constrained by the maximum allowed.
 */
export const getDynamicColumns = (
  screenWidth: number,
  maxColumns: number = 5,
  baseWidth: number = 300,
): number => {
  const calculatedColumns = Math.floor(screenWidth / baseWidth);
  return Math.min(Math.max(calculatedColumns, 1), maxColumns);
};
