import {
  Injectable,
  inject
} from '@angular/core';

import { ApiService }
from '../../../core/http/api.service';

import { ApiResponse }
from '../../../core/models/api-response';

import { ApiEndpoints }
from '../../../core/constants/api-endpoints';

import { PrescriptionItem }
from '../models/prescription-item';

import { CreatePrescriptionItem }
from '../models/create-prescription-item';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionItemService {

  private readonly api =
    inject(ApiService);


  // Get all prescription items

  getAll() {

    return this.api.get<
      ApiResponse<PrescriptionItem[]>
    >(
      ApiEndpoints.PRESCRIPTION_ITEM.GET_ALL
    );

  }


  // Get prescription item by ID

  getById(id: number) {

    return this.api.get<
      ApiResponse<PrescriptionItem>
    >(
      `${ApiEndpoints.PRESCRIPTION_ITEM.GET_BY_ID}/${id}`
    );

  }


  // Get items by prescription

  getByPrescription(prescriptionId: number) {

    return this.api.get<
      ApiResponse<PrescriptionItem[]>
    >(
      `${ApiEndpoints.PRESCRIPTION_ITEM.GET_BY_PRESCRIPTION}/${prescriptionId}`
    );

  }


  // Create prescription item

  create(
    model: CreatePrescriptionItem
  ) {

    return this.api.post<
      ApiResponse<number>
    >(
      ApiEndpoints.PRESCRIPTION_ITEM.CREATE,
      model
    );

  }


  // Update prescription item

  update(
    id: number,
    model: Omit<
      CreatePrescriptionItem,
      'prescriptionId' | 'medicineId'
    >
  ) {

    return this.api.put<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.PRESCRIPTION_ITEM.UPDATE}/${id}`,
      model
    );

  }


  // Delete prescription item

  delete(id: number) {

    return this.api.delete<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.PRESCRIPTION_ITEM.DELETE}/${id}`
    );

  }

}