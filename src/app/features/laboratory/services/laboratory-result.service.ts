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

import { LaboratoryResult }
  from '../models/laboratory-result';

import { CreateLaboratoryResult }
  from '../models/create-laboratory-result';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryResultService {

  private readonly api =
    inject(ApiService);


  getAll() {

    return this.api.get<
      ApiResponse<LaboratoryResult[]>
    >(
      ApiEndpoints.LABORATORY_RESULT.GET_ALL
    );

  }


  getById(id: number) {

    return this.api.get<
      ApiResponse<LaboratoryResult>
    >(
      `${ApiEndpoints.LABORATORY_RESULT.GET_BY_ID}/${id}`
    );

  }


  create(model: CreateLaboratoryResult) {

    return this.api.post<
      ApiResponse<number>
    >(
      ApiEndpoints.LABORATORY_RESULT.CREATE,
      model
    );

  }


  update(
    id: number,
    model: Omit<CreateLaboratoryResult, 'laboratoryOrderId'>
  ) {

    return this.api.put<
      ApiResponse<boolean>
    >(
      ApiEndpoints.LABORATORY_RESULT.UPDATE,
      {
        id,
        ...model
      }
    );

  }


  delete(id: number) {

    return this.api.delete<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.LABORATORY_RESULT.DELETE}/${id}`
    );

  }

}