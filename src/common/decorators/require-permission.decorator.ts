import { SetMetadata } from '@nestjs/common';

export type Permissionkey= 'canViewEvents'
  | 'canViewMarkets'
  | 'canViewOdds'
  | 'canViewSessions';

export const PERMISSION_KEY = 'permission';

export const RequirePermission = (permission: Permissionkey) =>
  SetMetadata(PERMISSION_KEY, permission);