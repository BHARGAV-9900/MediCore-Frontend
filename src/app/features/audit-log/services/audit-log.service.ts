import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { ApiService } from '../../../core/http/api.service';
import { ApiResponse } from '../../../core/models/api-response';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';

import { AuditLogPage } from '../models/audit-log';

export interface AuditLogFilters {
  pageNumber: number;
  pageSize: number;
  entityName?: string;
  action?: string;
  userId?: number;
  fromUtc?: string;
  toUtc?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private readonly api = inject(ApiService);

  getPaged(filters: AuditLogFilters) {
    let params = new HttpParams()
      .set('pageNumber', filters.pageNumber)
      .set('pageSize', filters.pageSize);

    if (filters.entityName) {
      params = params.set('entityName', filters.entityName);
    }

    if (filters.action) {
      params = params.set('action', filters.action);
    }

    if (filters.userId !== undefined) {
      params = params.set('userId', filters.userId);
    }

    if (filters.fromUtc) {
      params = params.set('fromUtc', filters.fromUtc);
    }

    if (filters.toUtc) {
      params = params.set('toUtc', filters.toUtc);
    }

    return this.api.get<ApiResponse<AuditLogPage>>(
      ApiEndpoints.AUDIT_LOG.GET_PAGED,
      params
    );
  }
}
