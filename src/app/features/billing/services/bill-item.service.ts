import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/http/api.service';
import { ApiResponse } from '../../../core/models/api-response';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';
import { BillItem, CreateBillItem } from '../models/bill-item';

@Injectable({ providedIn: 'root' })
export class BillItemService {
  private readonly api = inject(ApiService);

  getAll() {
    return this.api.get<ApiResponse<BillItem[]>>(ApiEndpoints.BILL_ITEM.GET_ALL);
  }

  getByBill(billId: number) {
    return this.api.get<ApiResponse<BillItem[]>>(
      `${ApiEndpoints.BILL_ITEM.GET_BY_BILL}/${billId}`
    );
  }

  create(model: CreateBillItem) {
    return this.api.post<ApiResponse<number>>(
      ApiEndpoints.BILL_ITEM.CREATE,
      model
    );
  }

  update(id: number, model: CreateBillItem) {
    return this.api.put<ApiResponse<boolean>>(
      `${ApiEndpoints.BILL_ITEM.UPDATE}/${id}`,
      model
    );
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<boolean>>(
      `${ApiEndpoints.BILL_ITEM.DELETE}/${id}`
    );
  }
}