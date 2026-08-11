export interface MedicalRecord {

  id: number;

  appointmentId: number;

  appointmentPublicId: string;

  diagnosis: string;

  symptoms: string;

  clinicalNotes: string;

  treatmentPlan: string;

  followUpInstructions?: string | null;

}