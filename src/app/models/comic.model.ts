export interface Comment {
  author_id: number;
  comment: string;
  reply: string[];
}

export interface Comic {
  cover: string;
  title: string;
  synopsis: string;
  published: string;
  author: string;
  genre: string[];
  state: string;
  author_id: number;
  content: string;
  comments: Comment[];
}
