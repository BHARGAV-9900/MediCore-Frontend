export interface PrescriptionItem {

  id: number;

  publicId: string;

  prescriptionId: number;

  prescriptionPublicId: string;

  medicineId: number;

  medicinePublicId: string;

  medicineName: string;

  dosage: string;

  frequency: string;

  durationInDays: number;

  quantity: number;

}