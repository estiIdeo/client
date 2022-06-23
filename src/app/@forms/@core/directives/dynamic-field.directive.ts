import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { takeWhile, filter } from 'rxjs/operators';
import { Field, FieldConfig } from '../interfaces';

@Directive({
  selector: '[dynamicField]',
})
export class DynamicFieldDirective implements Field, OnInit, OnChanges, OnDestroy {
  public component: ComponentRef<Field>;

  private isActive: boolean = true;
  private isVisible: boolean = true;

  @Input('dynamicField') public config: FieldConfig;
  @Input() public group: FormGroup;
  @Input() public type: Type<Field>;
  @Input() public id: string;

  @Output() public setVisibility: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public controlChange: EventEmitter<AbstractControl> = new EventEmitter<AbstractControl>();

  private _control: AbstractControl;
  @Input() public set control(ctrl: AbstractControl) {
    this._control = ctrl;
    this.controlChange.emit(this._control);
  }
  public get control(): AbstractControl {
    return this._control;
  }

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private fb: FormBuilder
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
      this.component.instance.id = this.id;
    }
  }

  ngOnInit(): void {
    if (!this.config.startInvisible) {
      this.createComponent();
    } else {
      setTimeout(() => this.setVisibility.emit(false));
    }

    if (!!this.config.setter) {
      this.config.setter.pipe(filter(x => !!x), takeWhile((x) => this.isActive)).subscribe((evt) => {
        switch (evt.type) {
          case 'setValue':
            this.group.controls[this.config.name].setValue(evt.value);
            break;
          case 'setDisabled':
            this.setDisabled(evt.value);
            break;
          case 'setVisibility':
            this.setFieldVisibility(evt.value);
            break;
          default:
            break;
        }
      });
    }
  }

  private createComponent() {
    const factory = this.resolver.resolveComponentFactory<Field>(this.type);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
    this.component.instance.id = this.id;

    if (this.config.controlType != 'none') {
      this.createAbstractControl();
    }
  }

  private setFieldVisibility(visibility: any) {
    if (visibility != this.isVisible) {
      setTimeout(() => {
        this.isVisible = visibility;
        this.setVisibility.emit(this.isVisible);
      });
      // if (!!this.isVisible) {
      //   this.createComponent();
      // }
      // else {
      //   debugger
      //   this.group.removeControl(this.config.name);
      //   if (!!this.component) this.component.destroy();
      // }
      // FIXME: check if there needed for this block section
    }
  }

  private setDisabled(enabled: boolean) {
    if (!enabled && !!this.group.controls[this.config.name]) {
      this.group.controls[this.config.name].disable();
    } else {
      this.group.controls[this.config.name].enable();
    }
  }

  public createAbstractControl() {
    switch (this.config.controlType) {
      case 'array':
        this.group.addControl(
          this.config.name,
          this.fb.array(
            this.config.createItem ? [this.config.createItem()] : [],
            this.config.validation,
            this.config.asyncValidation ? this.config.asyncValidation : null
          )
        );
        break;
      case 'group':
        this.group.addControl(
          this.config.name,
          this.fb.group(
            {},
            {
              validators: this.config.validation,
              asyncValidators: this.config.asyncValidation ? this.config.asyncValidation : null,
            }
          )
        );
        break;
      case 'control':
      default:
        if (!!this.group.get(this.config.name)) {
          let ctrl = this.group.get(this.config.name);
          if (!!this.config.validation?.length) {
            ctrl.setValidators(this.config.validation);
          }
          if (!!this.config.asyncValidation?.length) {
            ctrl.setAsyncValidators(this.config.asyncValidation);
          }
        } else {
          this.group.addControl(
            this.config.name,
            this.fb.control(
              { value: this.config.value, disabled: this.config.disabled },
              this.config.validation,
              this.config.asyncValidation ? this.config.asyncValidation : null
            )
          );
        }
        break;
    }
    this.control = this.group.controls[this.config.name];

    if (this.config.registerControl) {
      this.config.registerControl(this.control);
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
    if (!!this.component && !!this.component.instance && !!this.component.instance['ngOnDestroy']) {
      this.component.instance['ngOnDestroy']();
    }
  }
}
