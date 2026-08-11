export interface LaboratoryTest {

  id: number;

  publicId: string;

  name: string;

  price: number;

  description?: string | null;

  isActive: boolean;

}