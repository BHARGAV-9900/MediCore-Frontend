export interface LaboratoryOrder {

  id: number;

  publicId: string;


  // Appointment

  appointmentId: number;

  appointmentPublicId: string;

  appointmentDate: string;


  // Patient

  patientId: number;

  patientName: string;


  // Doctor

  doctorId: number;

  doctorName: string;


  // Laboratory Test

  laboratoryTestId: number;

  laboratoryTestPublicId: string;

  laboratoryTestName: string;

  laboratoryTestPrice: number;

}