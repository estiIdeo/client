import { createFeatureSelector } from '@ngrx/store';
import * as auth from './auth.reducers';

export interface IAppState {
  auth: auth.IState
}

export const reducers = {
  auth: auth.reducer
}

export const selectAuthState = createFeatureSelector<IAppState>('auth');