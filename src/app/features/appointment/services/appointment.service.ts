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

import { Appointment }
  from '../models/appointment';

import { CreateAppointment }
  from '../models/create-appointment';

import { UpdateAppointment }
  from '../models/update-appointment';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly api =
    inject(ApiService);


  // =========================================================
  // Get All Appointments
  // =========================================================

  getAll() {

    return this.api.get<
      ApiResponse<Appointment[]>
    >(
      ApiEndpoints.APPOINTMENT.GET_ALL
    );

  }


  // =========================================================
  // Get Appointment By ID
  // =========================================================

  getById(id: number) {

    return this.api.get<
      ApiResponse<Appointment>
    >(
      `${ApiEndpoints.APPOINTMENT.GET_BY_ID}/${id}`
    );

  }


  // =========================================================
  // Create Appointment
  // =========================================================

  create(
    model: CreateAppointment
  ) {

    return this.api.post<
      ApiResponse<number>
    >(
      ApiEndpoints.APPOINTMENT.CREATE,
      model
    );

  }


  // =========================================================
  // Update Appointment
  // =========================================================

  update(
    model: UpdateAppointment
  ) {

    return this.api.put<
      ApiResponse<void>
    >(
      `${ApiEndpoints.APPOINTMENT.UPDATE}/${model.id}`,
      model
    );

  }


  // =========================================================
  // Update Appointment Status
  // =========================================================

  updateStatus(
    id: number,
    status: number
  ) {

    return this.api.patch<
      ApiResponse<void>
    >(
      `${ApiEndpoints.APPOINTMENT.UPDATE}/${id}/status`,
      status
    );

  }


  // =========================================================
  // Delete Appointment
  // =========================================================

  delete(id: number) {

    return this.api.delete<
      ApiResponse<void>
    >(
      `${ApiEndpoints.APPOINTMENT.DELETE}/${id}`
    );

  }

}