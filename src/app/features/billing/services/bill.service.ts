import {
  Injectable,
  inject
} from '@angular/core';

import {
  ApiService
} from '../../../core/http/api.service';

import {
  ApiResponse
} from '../../../core/models/api-response';

import {
  ApiEndpoints
} from '../../../core/constants/api-endpoints';

import {
  Bill
} from '../models/bill';

import {
  CreateBill
} from '../models/create-bill';


@Injectable({
  providedIn: 'root'
})
export class BillService {

  private readonly api =
    inject(ApiService);


  // Get all bills

  getAll() {

    return this.api.get<
      ApiResponse<Bill[]>
    >(
      ApiEndpoints.BILL.GET_ALL
    );

  }


  // Get bill by ID

  getById(
    id: number
  ) {

    return this.api.get<
      ApiResponse<Bill>
    >(
      `${ApiEndpoints.BILL.GET_BY_ID}/${id}`
    );

  }


  // Create bill

  create(
    model: CreateBill
  ) {

    return this.api.post<
      ApiResponse<number>
    >(
      ApiEndpoints.BILL.CREATE,
      model
    );

  }


  // Update bill

  update(
    id: number,
    model: CreateBill
  ) {

    return this.api.put<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.BILL.UPDATE}/${id}`,
      {
        id,
        ...model
      }
    );

  }


  // Delete bill

  delete(
    id: number
  ) {

    return this.api.delete<
      ApiResponse<boolean>
    >(
      `${ApiEndpoints.BILL.DELETE}/${id}`
    );

  }

}