import { Observable } from 'rxjs';
import { Permission } from '../../infrastructure/permissions/permission';
import { SelectItem } from '../../components/table/models/select-item';
import { translateType } from '../../../@shared/types/translate.type';
import { IntelligenceKeys } from '../../../@shared/types/IntelligenceKeys.type';

export interface ButtonItem<T = any> {
  label?: IntelligenceKeys<translateType>;
  click?: (item: T, btn: ButtonItem) => void;
  hidden?: (item: T) => boolean;
  useOn?: number[];
  styleClass?: string;
  iconClass?: string,
  icon?: SelectItem['icon'];
  title?: IntelligenceKeys<translateType>;
  item?: T;
  type?: string | 'topActions';
  disabled$?: Observable<boolean>;
  disable?: (item: T) => boolean;
  disabled?: boolean;
  setTooltip?: (item: T) => IntelligenceKeys<translateType>;
  tooltip?: IntelligenceKeys<translateType>;
  permission?: Permission;
  href?: (item: T) => boolean | any[];
  queryParams?: (item: T) => any;
}
