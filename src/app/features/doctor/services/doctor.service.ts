import { Injectable, inject } from '@angular/core';

import { ApiService } from '../../../core/http/api.service';
import { ApiResponse } from '../../../core/models/api-response';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';

import { Doctor } from '../models/doctor';
import { CreateDoctor } from '../models/create-doctor';
import { UpdateDoctor } from '../models/update-doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private readonly api = inject(ApiService);

  getAll() {

    return this.api.get<ApiResponse<Doctor[]>>(
      ApiEndpoints.DOCTOR.GET_ALL
    );

  }

  getById(id: number) {

    return this.api.get<ApiResponse<Doctor>>(
      `${ApiEndpoints.DOCTOR.GET_BY_ID}/${id}`
    );

  }

  create(model: CreateDoctor) {

    return this.api.post<ApiResponse<number>>(
      ApiEndpoints.DOCTOR.CREATE,
      model
    );

  }

  update(model: UpdateDoctor) {

    return this.api.put<ApiResponse<void>>(
      `${ApiEndpoints.DOCTOR.UPDATE}/${model.id}`,
      model
    );

  }

  delete(id: number) {

    return this.api.delete<ApiResponse<void>>(
      `${ApiEndpoints.DOCTOR.DELETE}/${id}`
    );

  }

}