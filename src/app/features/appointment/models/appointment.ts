export interface Appointment {

  id: number;

  patientId: number;

  patientName: string;

  doctorId: number;

  doctorName: string;

  appointmentDate: string;

  status: number;

  reason: string;

  notes: string;

}