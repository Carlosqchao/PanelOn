export interface Comment {
  id?: string;
  author_id: string;
  content: string;
  created_at: Date | any;
  replies?: Comment[];
}

export interface Comic {
  author: string;
  author_id: number;
  cover: string;
  genre: string[];
  id: string;
  pegi: number;
  published: string;
  rating: number;
  relatedCharacters: number[];
  state: string;
  title: string;
  synopsis: string;
}
