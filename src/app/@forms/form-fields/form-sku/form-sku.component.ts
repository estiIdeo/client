import { Component } from '@angular/core';
import { FieldConfig } from '../../@core/interfaces/field-config';
import { Field } from '../../@core/interfaces/field';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'prx-form-sku',
  templateUrl: './form-sku.component.html',
  styleUrls: ['./form-sku.component.scss'],
})
export class FormSkuComponent implements Field<any> {
  public config: FieldConfig<any>;
  public group: FormGroup;
  public id: string;

  public sku: string

  constructor() {

  }

  ngOnInit(): void {
    this.group?.controls?.[this.config?.name].disable()
    this.sku = this.group?.controls?.[this.config?.name]?.value
  }
}