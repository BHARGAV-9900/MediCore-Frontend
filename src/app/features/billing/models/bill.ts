export interface Bill {

  id: number;

  publicId: string;

  appointmentId: number;

  appointmentPublicId: string;

  totalAmount: number;

  isPaid: boolean;

}