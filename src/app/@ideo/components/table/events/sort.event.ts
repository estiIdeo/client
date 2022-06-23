import { SortDirection } from '../models/types';

export interface SortEvent {
  column: string;
  direction: SortDirection;
}
