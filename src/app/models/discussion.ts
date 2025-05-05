import {Timestamp} from 'firebase/firestore';


export interface Comment {
  id?: string;
  author_id: string;
  content: string;
  created_at: Date | any;
}

export interface Discussion {
  id: string;
  title:string
  discussion:string
  date:Timestamp
  userId:string
}
