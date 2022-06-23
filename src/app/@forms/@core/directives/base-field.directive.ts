import { Directive, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Field, FieldConfig } from '../interfaces';

@Directive({
  selector: '[prxBaseField]',
})
export abstract class BaseFieldDirective<T extends AbstractControl = FormControl> implements Field, OnDestroy {
  constructor() { }

  protected isActive?: boolean = true;
  public abstract config: FieldConfig<any>;
  public abstract group: FormGroup;
  public abstract id: string;

  public get control(): T {
    return <T>this.group.controls[this.config.name];
  }


  ngOnDestroy() {
    this.isActive = false;
  }
}
