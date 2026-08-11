export interface CreateInventory {
  medicineId: number;

  quantityInStock: number;

  minimumStockLevel: number;

  batchNumber: string;

  expiryDate: string;

  supplier: string;

  storageLocation: string;
}