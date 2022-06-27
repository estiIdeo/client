import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
// import { config } from 'process';
import { DynamicFormStepMode } from '../../interfaces';
import { DynamicFormControl } from '../../interfaces/dynamic-form-control';

@Component({
  selector: 'ideo-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss'],
})
export class DynamicFormGroupComponent implements OnInit {
  @ViewChild('submitBtn', { static: false }) public submitBtn: ElementRef<HTMLButtonElement>;

  @Input() public config: DynamicFormControl[] = [];
  @Input() public mode: DynamicFormStepMode = DynamicFormStepMode.Regular;
  @Input() public validation: ValidatorFn[] = null;
  @Input() public errorMessages?: { [error: string]: string };
  @Input() public showSubmitButton?: boolean = true;
  @Input() public showCancelButton?: boolean = false
  @Input() template: TemplateRef<any>;
  @Input() public formRowCssClass: string = '';
  @Input() public formCssClass: string = '';
  @Input() public submitting?: boolean
  @Input() public errMsgClass: string = '';
  @Input() public submitText: string = null;
  @Input() public cancelText: string = null;

  @Output() public onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _form: FormGroup;
  @Output() public formChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() public get form(): FormGroup {
    return this._form;
  }
  public set form(v: FormGroup) {
    this._form = v;
    this.formChange.emit(this._form);
  }

  constructor(private fb: FormBuilder, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.form = this.createGroup();
    // for (let index = 0; index < this.config.length; index++) {
    //   const element = this.config[index];
    //   element.config.submit = () => this.submit();
    // }
  }

  private createGroup(): FormGroup {
    const group = this.fb.group(
      this.config.reduce((prev, curr, i) => {
        prev[curr.config.name] = this.fb.control(curr.config?.value);
        return prev;
      }, {})
    );
    if (!!this.validation?.length) {
      group?.setValidators(this.validation);
    }
    return group;
  }

  public cancel() {
    this.form.reset()
    this.form.markAsPristine()
    this.onCancel.emit(true)
  }

  public submit() {
    this.submitBtn?.nativeElement.click();
  }

  public handleSubmit(evt: any) {
    this.form.updateValueAndValidity();

    if (this.form.valid && !!this.submit) {
      this.onSubmit.emit(this.form.getRawValue());
    }
  }
}
