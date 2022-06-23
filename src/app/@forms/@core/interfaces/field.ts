import { FormGroup } from '@angular/forms';
import { FieldConfig } from '.';

export interface Field<DataModal = any, TModal = any> {
  config: FieldConfig<DataModal, TModal>;
  group: FormGroup;
  id: string;
}
