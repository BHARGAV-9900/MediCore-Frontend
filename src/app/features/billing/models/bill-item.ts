export interface BillItem {
  id: number;
  publicId: string;
  billId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface CreateBillItem {
  billId: number;
  description: string;
  quantity: number;
  unitPrice: number;
}