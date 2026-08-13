import { Injectable, inject } from '@angular/core';

import { ApiService } from '../../../core/http/api.service';

import { ApiResponse } from '../../../core/models/api-response';

import { ApiEndpoints } from '../../../core/constants/api-endpoints';

import {
  User,
  CreateUser,
  UpdateUser
} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly api = inject(ApiService);

  getAll() {
    return this.api.get<ApiResponse<User[]>>(
      ApiEndpoints.USER.GET_ALL
    );
  }

  getById(id: number) {
    return this.api.get<ApiResponse<User>>(
      `${ApiEndpoints.USER.GET_BY_ID}/${id}`
    );
  }

  create(model: CreateUser) {
    return this.api.post<ApiResponse<User>>(
      ApiEndpoints.USER.CREATE,
      model
    );
  }

  update(
    id: number,
    model: UpdateUser
  ) {
    return this.api.put<ApiResponse<User>>(
      `${ApiEndpoints.USER.UPDATE}/${id}`,
      model
    );
  }

  activate(id: number) {
    return this.api.patch<ApiResponse<boolean>>(
      `${ApiEndpoints.USER.ACTIVATE}/${id}/activate`,
      {}
    );
  }

  deactivate(id: number) {
    return this.api.patch<ApiResponse<boolean>>(
      `${ApiEndpoints.USER.DEACTIVATE}/${id}/deactivate`,
      {}
    );
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<boolean>>(
      `${ApiEndpoints.USER.DELETE}/${id}`
    );
  }

}