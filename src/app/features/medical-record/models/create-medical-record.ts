export interface CreateMedicalRecord {

  appointmentId: number;

  diagnosis: string;

  symptoms: string;

  clinicalNotes: string;

  treatmentPlan: string;

  followUpInstructions?: string | null;

}