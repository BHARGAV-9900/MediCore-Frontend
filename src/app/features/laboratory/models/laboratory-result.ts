export interface LaboratoryResult {

  id: number;

  publicId: string;

  laboratoryOrderId: number;

  laboratoryOrderPublicId: string;

  result: string;

  remarks?: string | null;

}