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

import { Prescription }
  from '../models/prescription';

import { CreatePrescription }
  from '../models/create-prescription';


@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private readonly api =
    inject(ApiService);


  // Get all prescriptions

  getAll() {

    return this.api.get<
      ApiResponse<Prescription[]>
    >(
      ApiEndpoints.PRESCRIPTION.GET_ALL
    );

  }


  // Get prescription by ID

  getById(id: number) {

    return this.api.get<
      ApiResponse<Prescription>
    >(
      `${ApiEndpoints.PRESCRIPTION.GET_BY_ID}/${id}`
    );

  }


  // Create prescription

  create(
    model: CreatePrescription
  ) {

    return this.api.post<
      ApiResponse<number>
    >(
      ApiEndpoints.PRESCRIPTION.CREATE,
      model
    );

  }


  // Update prescription

  update(
    id: number,
    model: CreatePrescription
  ) {

    return this.api.put<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.PRESCRIPTION.UPDATE}/${id}`,
      model
    );

  }


  // Delete prescription

  delete(id: number) {

    return this.api.delete<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.PRESCRIPTION.DELETE}/${id}`
    );

  }

}