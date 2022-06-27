import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArrayData } from './form-array';
import { FormGroup, FormArray, FormBuilder, AbstractControl, AbstractControlOptions } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { Field, FieldConfig, FieldEvent } from '@app/@forms/@core/interfaces';
import { FormTextComponent } from '../form-text/form-text.component';

@Component({
  selector: 'ideo-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.scss'],
})
export class FormArrayComponent extends BaseFieldDirective<FormArray & { controls: FormGroup[] }> implements Field<FormArrayData>, OnInit {
  public config: FieldConfig<FormArrayData>;
  public group: FormGroup;
  public id: string;
  public folded: boolean = false;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    super();
  }

  public get data() {
    return this?.config?.data
  }

  groupValidators(): AbstractControlOptions | null {
    if (!this.config?.data?.groupValidations?.length && !this.config?.data?.asyncGroupValidations?.length) {
      return null
    }
    return {
      ...(!!this.config?.data?.groupValidations?.length ? { validators: this.config?.data?.groupValidations } : {}),
      ...(!!this.config?.data?.asyncGroupValidations?.length ? { asyncValidators: this.config?.data?.asyncGroupValidations } : {})
    }
  }

  public globalFilterQuery: string
  public globalFilterDyn: DynamicFormControl = {
    type: FormTextComponent,
    config: {
      name: 'globalFilter',
      type: 'text',
      label: 'Result Filter',
      placeholder: 'search in result',
      onChange: (currentValue: any, control: AbstractControl) => (this.globalFilterQuery = currentValue, this.cd.markForCheck()),
      styleClass: 'col-6',
    }
  }


  public addingCtrl: FormGroup = this.fb.group({}, this.groupValidators());

  // public filtersForm: FormGroup
  // public resetFilters() {
  //   // (this.group.controls?.[this.config.name] as FormArray)?.controls?.forEach(c => (c.reset(), c.markAsPristine()))
  //   this?.config?.data?.formConfig.forEach(i => (!!i.config.hide && delete i.config.hide))
  //   this.cd.markForCheck()
  // }
  // public applyFilters(filters: any) {
  //   !!this?.config?.data?.applyFilters && this?.config?.data?.applyFilters(this.control, this.config?.data?.formConfig, filters)
  //   this.cd.markForCheck()
  // }


  ngOnInit(): void {

    // if (!!this.config.data.filters) {
    //   this.group.addControl(
    //     'filters', this.fb.group({}));
    // }

    this.addingCtrl = this.fb.group({}, this.groupValidators());
    if (!(this.control instanceof FormArray)) {
      this.group.removeControl(this.config.name);
      this.group.addControl(
        this.config.name,
        this.fb.array([], this.config.validation || [], this.config.asyncValidation || [])
      );
    }

    if (Array.isArray(this.config.value) && !!this.config.value?.length) {
      const valueArr = this.config.value as any[];
      valueArr?.forEach(element => {
        // console.log(
        //   Object.keys(element).filter(z => !Array.isArray(element[z]))
        //   ,
        //   Object.keys(element)
        // )
        const group = this.fb.group(
          Object.keys(element).filter(z => !Array.isArray(element[z])).reduce((acc, cur, i) => {
            acc[cur] = element[cur];
            return acc;
          }, {}), this.groupValidators()
        );
        this.control.push(group);
        group.patchValue(element);
      })
      this.cd.markForCheck();
    }

    if (Array.isArray(this.config.nestedValue) && !!this.config.nestedValue?.length) {
      const arr = this.config.nestedValue as any[];
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        let group = this.fb.group(
          Object.keys(element).reduce((acc, cur, i) => {
            acc[cur] = element[cur];
            return acc;
          }, {}), this.groupValidators()
        );
        this.control.push(group);
        group.patchValue(element);
      }
      this.cd.markForCheck();
    }
    if (!!this.config.setter) {
      this.config.setter
        .pipe(
          takeWhile((x) => this.isActive)
        )
        .subscribe((setter: FieldEvent) => {
          const { value: values } = setter
          switch (setter.type) {
            case 'onPatchValue': {
              if (!!values) {
                this.control.clear();
                for (let i = 0; i < values.length; i++) {
                  const value = values[i];
                  let group = this.fb.group({}, this.groupValidators());
                  this.control.push(group);
                  setTimeout(() => {
                    group.patchValue(value);
                  });
                }
                this.cd.markForCheck();
              }
              break;
            }
            case 'setValue': {
              if (!!values) {
                for (let i = 0; i < values.length; i++) {
                  const value = values[i];
                  const keys = Object.keys(value);
                  let group = this.fb.group(
                    keys.reduce((acc, cur, i) => {
                      acc[cur] = value[cur];
                      return acc;
                    }, this.groupValidators())
                  );
                  this.control.push(group);
                  this.cd.markForCheck();
                  setTimeout(() => {
                    group.patchValue(value);
                  });
                }
              }
              break;
            }
            default: {
              break
            }
          }
        })
    }
    // if (!!this.config?.data?.setter?.length) {
    //   this.config?.data?.setter?.forEach(
    //     s => s.pipe(
    //       takeWhile((x) => this.isActive)
    //     )
    //       .subscribe((setter: FormArraySetter) => {
    //         const { controlIndex, controlName, control } = setter
    //         const { value, type } = setter.setter
    //         const getParentControl = (): FormGroup => {
    //           if (!!control) {
    //             this.control?.controls?.find(i => control) || this.addingCtrl
    //           } else if (!!controlIndex) {
    //             return this.control?.controls?.[controlIndex] || this.addingCtrl
    //           } else {
    //             return this.addingCtrl
    //           }
    //         }
    //         const getControlToSet = (): AbstractControl => !!control ? control : getParentControl()?.controls?.[controlName]
    //         const getControlConfig = (controlName: string) => this.config.data.formConfig?.find(i => i.config.name === controlName)?.config
    //         const parentControl = getParentControl()
    //         const controlToSet = getControlToSet()
    //         switch (type) {
    //           case 'setVisibility': { //  not working good remove adding control work fine the dom don't render
    //             if (!!value) {
    //               !controlToSet && parentControl?.addControl(
    //                 controlName,
    //                 this.fb.control(controlName, getControlConfig(controlName)?.validation || [], getControlConfig(controlName)?.asyncValidation || [])
    //               )
    //             } else if (!!controlToSet) {
    //               parentControl?.removeControl(controlName)
    //             }
    //             break;
    //           }
    //           default: {
    //             break
    //           }
    //         }
    //         this.cd.markForCheck()
    //       })
    //   )
    // }
  }

  public removeConfig(index: number) {
    if (this.config.data?.onRemove) {
      this.config.data.onRemove(this.control.value[index]);
    }
    this.control.removeAt(index);
    this.config?.onChange && this.config?.onChange(this.control.value, this.control)
  }

  public addConfig() {
    this.control?.push(this.fb.group({}, this.groupValidators()));
  }

  saveToForm() {
    this.control.push(this.fb.group(this.addingCtrl.getRawValue()));
    let defaultVal = this.config.data.formConfig.reduce((obj, { config }) => {
      return {
        ...obj,
        [config.name]: {
          value: config.value,
          disabled: config.disabled
        }
      }
    }, {})
    this.addingCtrl.reset(defaultVal)
    this.config?.onChange && this.config?.onChange(this.control.value, this.control)
  }
}
