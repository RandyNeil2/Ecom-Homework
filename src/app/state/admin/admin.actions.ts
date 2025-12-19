import { createAction, props } from '@ngrx/store';

export interface TopProduct {
  productId: string;
  name: string;
  sold: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  user: string;
  total: number;
  createdAt: string;
  status: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}

export const loadAdminStats = createAction('[Admin] Load Admin Stats');

export const loadAdminStatsSuccess = createAction(
  '[Admin] Load Admin Stats Success',
  props<{ stats: AdminStats }>()
);

export const loadAdminStatsFailure = createAction(
  '[Admin] Load Admin Stats Failure',
  props<{ error: string }>()
);
