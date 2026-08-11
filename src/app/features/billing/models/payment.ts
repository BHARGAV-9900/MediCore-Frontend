import { PaymentMethod } from './payment-method';

export interface Payment {
  id: number;
  publicId: string;
  billId: number;
  billPublicId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paidOn: string;
}