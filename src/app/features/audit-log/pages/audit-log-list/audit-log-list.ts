import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuditLogService } from '../../services/audit-log.service';
import { AuditLog } from '../../models/audit-log';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-audit-log-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-log-list.html',
  styleUrl: './audit-log-list.scss'
})
export class AuditLogList implements OnInit {
  private readonly service = inject(AuditLogService);
  private readonly notification = inject(NotificationService);

  logs: AuditLog[] = [];
  loading = false;
  expandedId: number | null = null;

  pageNumber = 1;
  pageSize = 25;
  totalCount = 0;
  totalPages = 0;

  entityName = '';
  action = '';
  userId: number | null = null;
  fromDate = '';
  toDate = '';

  readonly actions = ['Created', 'Updated', 'Deleted'];

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;

    this.service.getPaged({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      entityName: this.entityName.trim() || undefined,
      action: this.action || undefined,
      userId: this.userId ?? undefined,
      fromUtc: this.fromDate ? new Date(`${this.fromDate}T00:00:00`).toISOString() : undefined,
      toUtc: this.toDate ? new Date(`${this.toDate}T23:59:59.999`).toISOString() : undefined
    }).subscribe({
      next: response => {
        this.logs = response.data?.items ?? [];
        this.totalCount = response.data?.totalCount ?? 0;
        this.totalPages = response.data?.totalPages ?? 0;
        this.loading = false;
      },
      error: error => {
        console.error(error);
        this.loading = false;
        this.notification.error('Unable to load audit logs');
      }
    });
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadLogs();
  }

  clearFilters(): void {
    this.entityName = '';
    this.action = '';
    this.userId = null;
    this.fromDate = '';
    this.toDate = '';
    this.applyFilters();
  }

  previousPage(): void {
    if (this.pageNumber <= 1) {
      return;
    }

    this.pageNumber--;
    this.loadLogs();
  }

  nextPage(): void {
    if (this.pageNumber >= this.totalPages) {
      return;
    }

    this.pageNumber++;
    this.loadLogs();
  }

  toggleDetails(log: AuditLog): void {
    this.expandedId = this.expandedId === log.id ? null : log.id;
  }

  formatJson(value: string | null): string {
    if (!value) {
      return '—';
    }

    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
}
