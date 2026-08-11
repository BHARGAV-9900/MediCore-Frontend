export interface CreatePrescription {

  appointmentId: number;

  instructions: string;

  notes?: string | null;

}