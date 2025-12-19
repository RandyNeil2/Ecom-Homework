import { createReducer, on } from '@ngrx/store';
import * as AdminActions from './admin.actions';

export interface AdminState {
  stats: AdminActions.AdminStats | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AdminState = {
  stats: null,
  loading: false,
  error: null
};

export const adminReducer = createReducer(
  initialState,

  on(AdminActions.loadAdminStats, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AdminActions.loadAdminStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: false,
    error: null
  })),

  on(AdminActions.loadAdminStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
