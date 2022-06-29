import { Permission } from '../../@ideo/infrastructure/permissions/permission';
import { Observable } from 'rxjs';
import { SelectItem } from '../../@ideo/components/table/models/select-item';
import { IntelligenceKeys } from '../../@shared/types/IntelligenceKeys.type';
import { translateType } from '@app/@shared/types/translate.type';
export interface NavigationOptions {
  title: IntelligenceKeys<translateType>;
  title$?: Observable<IntelligenceKeys<translateType>>;
  link?: string;
  click?: (item: NavigationOptions) => void;
  data?: any;
  icon?: NavigationIcon;
  style?: string;
  level?: number;
  items?: NavigationOptions[];
  target?: '_self' | '_blank' | '_parent' | '_top';
  open?: boolean;
  permission?: Permission;
}

export interface NavigationIcon {
  name?: SelectItem['icon'];
  letter?: string;
  size?: string;
}
