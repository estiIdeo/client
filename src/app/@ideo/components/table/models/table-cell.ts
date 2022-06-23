import { TableColumn } from '../../../../@ideo/components/table/models/table-column';

export interface TableCell {
  col: TableColumn;
  item: any;
  isStatic?: boolean;
  isTranslate?: boolean;
}
