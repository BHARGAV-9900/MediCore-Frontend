import { Injectable, inject } from '@angular/core';

import { ApiService } from '../../../core/http/api.service';

import { ApiEndpoints } from '../../../core/constants/api-endpoints';

import { ApiResponse } from '../../../core/models/api-response';

import { Patient } from '../models/patient';

import { CreatePatient } from '../models/create-patient';

import { UpdatePatient } from '../models/update-patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly api =
    inject(ApiService);

  getAll() {

    return this.api.get<ApiResponse<Patient[]>>(
      ApiEndpoints.PATIENT.GET_ALL
    );

  }

  getById(id: number) {

    return this.api.get<ApiResponse<Patient>>(
      `${ApiEndpoints.PATIENT.GET_BY_ID}/${id}`
    );

  }

  create(model: CreatePatient) {

    return this.api.post<ApiResponse<number>>(
      ApiEndpoints.PATIENT.CREATE,
      model
    );

  }

  update(model: UpdatePatient) {

    return this.api.put<ApiResponse<void>>(
      `${ApiEndpoints.PATIENT.UPDATE}/${model.id}`,
      model
    );

  }

  delete(id: number) {

    return this.api.delete<ApiResponse<void>>(
      `${ApiEndpoints.PATIENT.DELETE}/${id}`
    );

  }

}