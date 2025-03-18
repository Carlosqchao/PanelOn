export interface Comment {
  author: number;
  comment: string;
  reply: number[];
}

export interface Comic {
  id: number;
  title: string;
  synopsis: string;
  genre: number[];
  state: string;
  author: number;
  content: string;
  comments?: Comment[];
}
