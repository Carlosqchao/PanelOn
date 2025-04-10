export interface Payment {
  amount: number;
  currency: string;
  date: number[];
  id: number;
  payer:number;
  status: string;
  type: string;
}
