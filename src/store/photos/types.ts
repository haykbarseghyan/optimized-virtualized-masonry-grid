export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  src: {
    original: string;
    medium: string;
    small: string;
  };
  liked: boolean;
}

export interface PexelsResponse {
  page: number;
  per_page: number;
  photos: Photo[];
  total_results: number;
  next_page?: string;
}

export type PexelsRequest = { query: string; perPage: number; page: number };
