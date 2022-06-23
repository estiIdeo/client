import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Type,
  Output,
  EventEmitter,
  AfterViewInit,
  TemplateRef,
} from '@angular/core';
import { AbstractControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { distinctUntilChanged, filter, takeWhile } from 'rxjs/operators';
import { DynamicFormStepMode, Field, FieldConfig } from '../../interfaces';
import { DynamicFormControl } from '../../interfaces/dynamic-form-control';
import { StringHelperService } from '../../../../@ideo/infrastructure/services/string-helper.service';
import { FormTextComponent } from '../../../form-fields/form-text/form-text.component';
import { HostBinding } from '@angular/core';

@Component({
  selector: 'ideo-dynamic-form-control',
  templateUrl: './dynamic-form-control.component.html',
  styleUrls: ['./dynamic-form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormControlComponent implements OnInit, AfterViewInit {
  public type: Type<Field>;
  public config: FieldConfig<any>;
  public id: string = `control-${this.stringHelper.randomStr(4)}`;
  public control: AbstractControl;
  public visible: boolean = true;
  private isActive: boolean = true;
  @Input() template: TemplateRef<any>;
  @Input() public mode: DynamicFormStepMode;
  @Input() public isRequired: boolean;
  @Input() public showLabel: boolean = true;
  @Input() public group: FormGroup;
  @Input() public wrapStyleClass: string;

  @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onSubmit: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class.d-none') hide: boolean = false;

  @Input() public set dynamicControl(dynamicControl: DynamicFormControl) {
    if (!dynamicControl?.type) {
      return;
    }
    this.type = dynamicControl.type || FormTextComponent;
    this.config = dynamicControl.config;
    this.mode = this.mode || (dynamicControl.config && dynamicControl.config.mode) || DynamicFormStepMode.Regular;

    this.isRequired =
      dynamicControl.config.validation && !!dynamicControl.config.validation.find((x) => x == Validators.required);
    this.cd.detectChanges();
  }

  constructor(private stringHelper: StringHelperService, private cd: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    if (!!this.config && !!this.control && !!this.onChange) {
      this.control.valueChanges.pipe(takeWhile((z) => this.isActive), distinctUntilChanged()).subscribe((val) => this.onChange.emit(val));
    }
  }

  ngOnInit(): void {
    if (this.config && this.config.setter) {
      this.config.setter
        .pipe(
          filter((evt) => !!evt),
          takeWhile((x) => this.isActive),
        )
        .subscribe((event) => {
          switch (event?.type) {
            case 'requiredSetter':
              if (this.isRequired !== event.value) {
                this.control.clearValidators()
                this.config.validation = [...this.config?.validation?.filter(x => x !== Validators.required) || [], ...!!event?.value ? [Validators.required] : []]
                this.control.setValidators(this.config?.validation)
                let tempVal = this.control.value;
                this.control.reset()
                 if(tempVal!=null && event.value){
                  this.control.setValue(tempVal);
                } 
              }
              this.isRequired = event.value;
              this.cd.detectChanges();
              this.cd.markForCheck()
              break;
            // TODO
            case 'setValidation':
              const { active, validation } = event?.value as { active: boolean, validation: ValidatorFn }
              if ((!!active || active === false) && validation) {
                const strFunc = validation?.toString()
                const validationStringFuncs: string[] = this.config?.validation?.map(i => i?.toString()) || []
                const resetControl = () => {
                  this.control.clearValidators()
                  this.control.setValidators(this.config?.validation)
                  this.control.updateValueAndValidity()
                  this.cd.detectChanges();
                  this.cd.markForCheck()
                }
                if (!!active && !validationStringFuncs?.includes(strFunc)) {
                  this.config.validation = [...this.config?.validation || [], validation]
                  resetControl()
                } else if (!active && !!validationStringFuncs?.includes(strFunc)) {
                  this.config.validation = [...this.config?.validation?.filter(i => i?.toString() !== strFunc)]
                  resetControl()
                }
              }
              break;
            case 'setVisibility':
              this.setVisibility(event.value)
              break;
            default:
              break;
          }
        });
    }
  }

  public setVisibility(isVisibile: boolean) {
    this.visible = isVisibile;
    this.hide = !this.visible
    this.cd.markForCheck();
  }
}
