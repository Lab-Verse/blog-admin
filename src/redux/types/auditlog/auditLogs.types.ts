// src/app/redux/types/auditLogs.types.ts

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
}

export enum AuditEntityType {
  USER = 'USER',
  POST = 'POST',
  COMMENT = 'COMMENT',
  CATEGORY = 'CATEGORY',
  TAG = 'TAG',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
}

export type AuditSeverity = 'info' | 'warning' | 'error';

export interface AuditLogMetadata {
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface AuditLog {
  id: string;
  orgId?: string;
  userId?: string | null;
  action: AuditAction;
  entityType?: AuditEntityType | null;
  entityId?: string | null;
  description?: string | null;
  severity?: AuditSeverity;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: AuditLogMetadata | null;
  createdAt?: string;
}

export interface GetAuditLogsQuery {
  orgId?: string;
  userId?: string;
  action?: AuditAction;
  entityType?: AuditEntityType;
  entityId?: string;
  severity?: AuditSeverity;
  from?: string; // ISO date
  to?: string;   // ISO date
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAuditLogsResponse {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateAuditLogDto {
  orgId?: string;
  userId?: string | null;
  action: AuditAction;
  entityType?: AuditEntityType | null;
  entityId?: string | null;
  description?: string | null;
  severity?: AuditSeverity;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: AuditLogMetadata | null;
}

export interface AuditLogsState {
  list: AuditLog[];
  total: number;
  page: number;
  limit: number;
  selectedAuditLog: AuditLog | null;
  isLoading: boolean;
  error: string | null;
}
