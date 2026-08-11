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

import { Medicine }
  from '../models/medicine';

import { CreateMedicine }
  from '../models/create-medicine';


@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  private readonly api =
    inject(ApiService);


  // Get all medicines

  getAll() {

    return this.api.get<
      ApiResponse<Medicine[]>
    >(
      ApiEndpoints.MEDICINE.GET_ALL
    );

  }


  // Get medicine by ID

  getById(id: number) {

    return this.api.get<
      ApiResponse<Medicine>
    >(
      `${ApiEndpoints.MEDICINE.GET_BY_ID}/${id}`
    );

  }


  // Create medicine

  create(
    model: CreateMedicine
  ) {

    return this.api.post<
      ApiResponse<number>
    >(
      ApiEndpoints.MEDICINE.CREATE,
      model
    );

  }


  // Update medicine

  update(
    id: number,
    model: CreateMedicine
  ) {

    return this.api.put<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.MEDICINE.UPDATE}/${id}`,
      model
    );

  }


  // Delete medicine

  delete(id: number) {

    return this.api.delete<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.MEDICINE.DELETE}/${id}`
    );

  }

}