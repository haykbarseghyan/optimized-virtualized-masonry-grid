import { describe, expect, it } from 'vitest';

import { Photo } from '../../../store/photos/types';
import { getDynamicColumns, masonryGrid } from '../utils';

const mockPhotos: Photo[] = [
  {
    id: 2325447,
    width: 5184,
    height: 3456,
    url: 'https://www.pexels.com/photo/hot-air-balloon-2325447/',
    photographer: 'Francesco Ungaro',
    photographer_url: 'https://www.pexels.com/@francesco-ungaro',
    photographer_id: 21273,

    src: {
      original:
        'https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg',
      large2x:
        'https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'Hot air balloons float over the mesmerizing landscape of Cappadocia, Turkey at sunrise.',
  },
  {
    id: 886521,
    width: 4110,
    height: 2642,
    url: 'https://www.pexels.com/photo/person-s-left-hand-holding-green-leaf-plant-886521/',
    photographer: 'Alena Koval',
    photographer_url: 'https://www.pexels.com/@alena-koval-233944',
    photographer_id: 233944,
    src: {
      original:
        'https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg',
      large2x:
        'https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'A hand painted green holds a fresh plant sprout against a light background, symbolizing growth and sustainability.',
  },
];

describe('masonryGrid', () => {
  it('distributes images into the correct number of columns', () => {
    const numColumns = 2;
    const columnWidth = 300;
    const result = masonryGrid(mockPhotos, columnWidth, numColumns);

    expect(result).toHaveLength(numColumns);
    result.forEach((column) => {
      expect(Array.isArray(column)).toBe(true);
    });
  });

  it('scales images correctly based on column width', () => {
    const columnWidth = 300;
    const result = masonryGrid(mockPhotos, columnWidth, 2);

    result.forEach((column) => {
      column.forEach((image) => {
        const originalPhoto = mockPhotos.find((photo) => photo.id === image.id);
        expect(image.scaledWidth).toBe(columnWidth);
        expect(image.scaledHeight).toBeCloseTo(
          (originalPhoto!.height / originalPhoto!.width) * columnWidth,
        );
      });
    });
  });

  it('handles empty images array', () => {
    const result = masonryGrid([], 300, 3);
    expect(result).toEqual([[], [], []]);
  });
});

describe('getDynamicColumns', () => {
  it('calculates the correct number of columns based on screen width', () => {
    expect(getDynamicColumns(1200, 5, 300)).toBe(4); // 1200 / 300 = 4
    expect(getDynamicColumns(600, 5, 300)).toBe(2); // 600 / 300 = 2
    expect(getDynamicColumns(1500, 5, 300)).toBe(5); // Maximum columns is 5
  });

  it('respects minimum column constraints', () => {
    expect(getDynamicColumns(200, 5, 300)).toBe(1); // Minimum is 1 column
  });

  it('respects maximum column constraints', () => {
    expect(getDynamicColumns(5000, 3, 300)).toBe(3); // Maximum is 3 columns
  });

  it('handles edge cases with zero or negative screen width', () => {
    expect(getDynamicColumns(0, 5, 300)).toBe(1); // Minimum 1 column
    expect(getDynamicColumns(-500, 5, 300)).toBe(1); // Minimum 1 column
  });
});
