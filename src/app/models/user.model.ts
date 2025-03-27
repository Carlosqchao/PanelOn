export interface FullName {
  name: string;
  middleName: string;
  lastName: string;
}

export interface Subscription {
  type: string;
  timeStart: Date;
}

export interface User {
  id: number;
  fullName: FullName;
  userName: string;
  mail: string;
  password: string; // Nota: En producción deberías manejar esto de manera segura
  description: string;
  image: string;
  subscription: Subscription;
  favourites: number[];
  reading: number[];
  readed: number[];
  bought: number[];
  comics: number[];
  wishlist: number[];
  likes: number;
}

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
  comments?: Comment[]; // Subcollección
}
