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

import { LaboratoryTest }
from '../models/laboratory-test';

import { CreateLaboratoryTest }
from '../models/create-laboratory-test';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryTestService {

  private readonly api =
    inject(ApiService);


  // ============================================
  // GET ALL
  // ============================================

  getAll() {

    return this.api.get<
      ApiResponse<LaboratoryTest[]>
    >(
      ApiEndpoints.LABORATORY_TEST.GET_ALL
    );

  }


  // ============================================
  // GET BY ID
  // ============================================

  getById(id: number) {

    return this.api.get<
      ApiResponse<LaboratoryTest>
    >(
      `${ApiEndpoints.LABORATORY_TEST.GET_BY_ID}/${id}`
    );

  }


  // ============================================
  // CREATE
  // ============================================

  create(model: CreateLaboratoryTest) {

    return this.api.post<
      ApiResponse<number>
    >(
      ApiEndpoints.LABORATORY_TEST.CREATE,
      model
    );

  }


  // ============================================
  // UPDATE
  // ============================================

  update(
    id: number,
    model: CreateLaboratoryTest
  ) {

    return this.api.put<
      ApiResponse<boolean>
    >(
      ApiEndpoints.LABORATORY_TEST.UPDATE,
      {
        id,
        ...model
      }
    );

  }


  // ============================================
  // DELETE
  // ============================================

  delete(id: number) {

    return this.api.delete<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.LABORATORY_TEST.DELETE}/${id}`
    );

  }

}