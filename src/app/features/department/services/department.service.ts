import { Injectable, inject } from '@angular/core';

import { ApiService } from '../../../core/http/api.service';
import { ApiResponse } from '../../../core/models/api-response';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';

import { Department } from '../models/department';
import { CreateDepartment } from '../models/create-department';
import { UpdateDepartment } from '../models/update-department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private readonly api = inject(ApiService);

  getAll() {

    return this.api.get<ApiResponse<Department[]>>(
      ApiEndpoints.DEPARTMENT.GET_ALL
    );

  }

  getById(id: number) {

    return this.api.get<ApiResponse<Department>>(
      `${ApiEndpoints.DEPARTMENT.GET_BY_ID}/${id}`
    );

  }

  create(model: CreateDepartment) {

    return this.api.post<ApiResponse<number>>(
      ApiEndpoints.DEPARTMENT.CREATE,
      model
    );

  }

  update(model: UpdateDepartment) {

    return this.api.put<ApiResponse<void>>(
      `${ApiEndpoints.DEPARTMENT.UPDATE}/${model.id}`,
      model
    );

  }

  delete(id: number) {

    return this.api.delete<ApiResponse<void>>(
      `${ApiEndpoints.DEPARTMENT.DELETE}/${id}`
    );

  }

}