export interface AuditLog {
  id: number;
  publicId: string;
  userId: number | null;
  userEmail: string | null;
  role: string | null;
  action: string;
  entityName: string;
  entityPublicId: string | null;
  oldValues: string | null;
  newValues: string | null;
  ipAddress: string | null;
  requestPath: string | null;
  requestId: string | null;
  occurredAtUtc: string;
}

export interface AuditLogPage {
  items: AuditLog[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
