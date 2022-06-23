import { Type } from '@angular/core';
import { Field, FieldConfig } from '.';
import { Permission } from '../../../@ideo/infrastructure/permissions/permission';

export interface DynamicFormControl<TModal = any, DataModal = any> {
  type: Type<Field<DataModal, TModal>>;
  config: FieldConfig<DataModal, TModal>;
  permission?: Permission;
}
