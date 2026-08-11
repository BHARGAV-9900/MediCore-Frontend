import { PaymentMethod } from './payment-method';

export interface CreatePayment {
  billId: number;
  amount: number;
  paymentMethod: PaymentMethod;
}