import { ButtonItem } from '../../../core/models/button-item';
export interface TableRowGroup<T = any> {
  field: string;
  title?: string;
  totalFieldName?: string;
  parsedTitle?: (item: any) => string;
  actions?: ButtonItem<T>[];
  position?: 'center' | 'start' | 'end'
}
