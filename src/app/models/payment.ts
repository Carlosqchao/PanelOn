export interface Payment {
  id?: string;
  amount: number;
  currency: string;
  date: number[];
  payer:number;
  status: string;
  type: string;
}
