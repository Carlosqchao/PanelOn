export interface Donation {
  id?: string;
  amount: number;
  currency: string;
  date: number[];
  message: string;
  payee: number;
  payer: number;
  status: string;
}
