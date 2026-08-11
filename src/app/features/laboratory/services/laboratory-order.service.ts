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

import { LaboratoryOrder }
from '../models/laboratory-order';

import { CreateLaboratoryOrder }
from '../models/create-laboratory-order';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryOrderService {

  private readonly api =
    inject(ApiService);


  // Get all laboratory orders

  getAll() {

    return this.api.get<
      ApiResponse<LaboratoryOrder[]>
    >(
      ApiEndpoints.LABORATORY_ORDER.GET_ALL
    );

  }


  // Get laboratory order by ID

  getById(id: number) {

    return this.api.get<
      ApiResponse<LaboratoryOrder>
    >(
      `${ApiEndpoints.LABORATORY_ORDER.GET_BY_ID}/${id}`
    );

  }


  // Create laboratory order

  create(
    model: CreateLaboratoryOrder
  ) {

    return this.api.post<
      ApiResponse<number>
    >(
      ApiEndpoints.LABORATORY_ORDER.CREATE,
      model
    );

  }


  // Update laboratory order

  update(
    id: number,
    model: CreateLaboratoryOrder
  ) {

    return this.api.put<
      ApiResponse<boolean>
    >(
      ApiEndpoints.LABORATORY_ORDER.UPDATE,
      {
        id,
        ...model
      }
    );

  }


  // Delete laboratory order

  delete(id: number) {

    return this.api.delete<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.LABORATORY_ORDER.DELETE}/${id}`
    );

  }

}