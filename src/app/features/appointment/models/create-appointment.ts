export interface CreateAppointment {

  patientId: number;

  doctorId: number;

  appointmentDate: string;

  reason: string;

  notes: string;

}