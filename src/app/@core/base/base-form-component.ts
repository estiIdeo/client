import { FormGroup } from '@angular/forms';
import { BaseComponent } from './base-component';
import { Directive } from '@angular/core';

@Directive()
export class BaseFormComponent extends BaseComponent {
  public error: string;
  public form: FormGroup;
}
