import { Type } from '@angular/core';
import { Permission } from '../../../@ideo/infrastructure/permissions/permission';
import { Field } from './field';
import { FieldConfig } from './field-config';

export interface DynamicFormControl<TModal = any, DataModal = any> {
  type: Type<Field<DataModal, TModal>>;
  config: FieldConfig<DataModal, TModal>;
  permission?: Permission;
}
