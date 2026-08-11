export interface Inventory {
  id: number;

  medicineId: number;

  medicineName: string;

  quantityInStock: number;

  minimumStockLevel: number;

  batchNumber: string;

  expiryDate: string;

  supplier: string;

  storageLocation: string;

  isActive: boolean;
}