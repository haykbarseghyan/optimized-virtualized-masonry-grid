export type GridImage = {
  id: number;
  scaledWidth: number;
  scaledHeight: number;
  src: {
    blob?: Blob;
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
};

export type MasonryColumn = GridImage[];
