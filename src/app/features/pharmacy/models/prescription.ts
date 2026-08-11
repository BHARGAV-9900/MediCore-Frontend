export interface Prescription {

  id: number;

  publicId: string;

  appointmentId: number;

  appointmentPublicId: string;

  instructions: string;

  notes: string | null;

}