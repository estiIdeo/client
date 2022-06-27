import { Permission } from '@app/@ideo/infrastructure/permissions/permission';
import { IdeoIconModel } from '@app/@shared/models/ideo-icon.model';
import { AnyObject } from '@app/@shared/types/any-type.type';
import { IntelligenceKeys } from '@app/@shared/types/IntelligenceKeys.type';
import { translateType } from '@app/@shared/types/translate.type';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';


export type keyValuePairPipeDataObject<T = any> = { pipeName?: IntelligenceKeys<'date' | 'currency' | 'enum' | 'translate' | 'cache' | 'price' | 'percent' | 'image' | 'sku' | 'default'>, value?: T[keyof T], args?: any[] } & AnyObject
type keyValuePairPipeDataObjectType<D = any, T = any> = D extends any ? keyValuePairPipeDataObject<T> : D

export interface SelectItem<T = any, DModal = any> {
  label?: IntelligenceKeys<translateType>;
  value: T[keyof T & string];
  styleClass?: string;
  icon?: IntelligenceKeys<keyof IdeoIconModel> | IconDefinition | number;
  title?: string;
  disabled?: boolean;
  click?: (evt: Event | T) => void;
  href?: (item: T) => any[];
  tooltip?: string;
  link?: string;
  hover?: boolean;
  group?: string;
  items?: SelectItem<T, DModal>[];
  data?: keyValuePairPipeDataObjectType<DModal, T>;
  flag?: boolean;
  permission?: Permission;
}
export interface TranslateSelectItem {
  /**
  * filed label
  */
  filedLabel?: string
  /**
  * error name
  */
  errorName?: string;
  /**
  * translate item
  */
  label?: IntelligenceKeys<translateType>;
  /**
  * translate params named value // similar to entity
  */
  value?: IntelligenceKeys<translateType>;
  /**
  * translate params object
  */
  data?: { [key: string]: IntelligenceKeys<translateType> | number };
}
