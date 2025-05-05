import {Timestamp} from 'firebase/firestore';

export interface Discussion {
  id: string;
  title:string
  discussion:string
  date:Timestamp
  userId:string
}
