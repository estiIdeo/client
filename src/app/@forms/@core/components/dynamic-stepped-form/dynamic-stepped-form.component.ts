import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { DynamicSteppedForm, SteppedFormFooterMode } from '../../interfaces/dynamic-stepped-form';
import { CdkStepper } from '@angular/cdk/stepper';
import { Directionality } from '@angular/cdk/bidi';
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { StepFormGroup } from '../../../../@shared/models/wizard-form.config';
import { StepperService } from '../../services/stepper.service';
import { range } from 'lodash';
import { RtlService } from '../../../../@shared/services/rtl.service';


@Component({
  selector: 'ideo-dynamic-stepped-form',
  templateUrl: './dynamic-stepped-form.component.html',
  styleUrls: ['./dynamic-stepped-form.component.scss'],
})
export class DynamicSteppedFormComponent extends CdkStepper implements OnInit {
  constructor(private fb: FormBuilder, ref: ChangeDetectorRef, dir: Directionality,
    private stepperService: StepperService, private cd: ChangeDetectorRef,
     private rtlService: RtlService
  ) {
    super(dir, ref);
  }
  @ViewChild('cdkStepper', { static: false }) public cdkStepper: CdkStepper;

  @ViewChild('submitBtn', { static: false }) public submitBtn: ElementRef<HTMLButtonElement>;
  @Input() public stepBody: Object;
  @Input() public useStepperService?: boolean
  @Input() public config: DynamicSteppedForm[] = [];
  @Input() public validation: ValidatorFn[] = null;
  @Input() public errorMessages?: { [error: string]: string };
  @Input() public formRowCssClass: string = '';
  @Input() public formCssClass: string = '';
  @Input() public bodyClass: string = '';
  @Input() public isLinear = true;
  @Input() public isEditable = true;
  @Input() public footerMode: SteppedFormFooterMode = SteppedFormFooterMode.Arrows;
  @Input() public formValue?: BehaviorSubject<any>;

  public stepErrors: { [step: number]: number } = {};
  public selectedInd: number = 0;

  @Output() public onSubmit: EventEmitter<any> = new EventEmitter<any>();

  private _form: StepFormGroup = null;
  @Output() public formChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() public get form(): StepFormGroup {
    return this._form;
  }

  public isAlive: boolean = true

  public get validForm(): boolean {
    return this.form.valid && this.form.controls.forms.controls.every((i) => i.valid && Object.keys(i?.controls).every(t => !i?.controls?.[t]?.invalid))
  }


  public get isNextDisable(): boolean {
    return this.config?.[this.selectedIndex + 1]?.disable
  }

  public get isRtl(): boolean {
    return this.rtlService.isRtl;
  }

  public get isPrevDisable(): boolean {
    return this.config?.[this.selectedIndex - 1]?.disable
  }

  // log(val: any) {
  //   console?.log(val)
  // }

  ngOnDestroy() {
    this.isAlive = false
  }

  public set form(v: StepFormGroup) {
    this._form = v;
    this.formChange.emit(this._form);
  }

  public icons: any = {
    arrowLeft: faLongArrowAltLeft,
    arrowRight: faLongArrowAltRight,
  };

  ngOnInit(): void {
    this.formValue.pipe(takeWhile((x) => this.isAlive)).subscribe((res) => {
      if (!!this.form?.controls?.forms?.controls?.length) {
        let forms = this.form?.controls?.forms?.controls;
        for (let i: number = 0; i < forms.length; i++) {
          const form: FormGroup = forms[i] as any;
          form.patchValue(res, { onlySelf: false, emitEvent: true });
          setTimeout(() => {
            Object.keys(form?.controls || {}).forEach(i => {
              if (form?.get(i) instanceof FormGroup) {
                form.get(i)?.patchValue(res)
              }
            })
          })
        }
      }
    });
    setTimeout(() => {
      this.stepErrors = this.config.reduce((prev, curr, i) => {
        prev[i] = 0;
        return prev;
      }, {});
      this.form = this.fb.group({
        forms: this.fb.array([
          ...this.config.map((z, i) =>
            this.fb.group(
              this.config[i].group.reduce((prev, curr, i) => {
                prev[curr.config.name] = curr.config?.value;
                return prev;
              }, {})
            )
          ),
        ]),
      }) as StepFormGroup;

      this.stepperService.form = this.form;
    });
    if (!!this.validation && !!this.validation.length) {
      this.form.setValidators(this.validation);
    }
    if (!!this.useStepperService) {
      this.stepperService.stepChanged.next(0)
      this.stepperService.relativeStep.pipe(takeWhile(r => this.isAlive)).subscribe(res => {
        if (res > 0) {
          range(0, res).forEach(i => {
            this.cdkStepper.next()
          })
        } else {
          range(res, 0).forEach(i => {
            this.cdkStepper.previous()
          })
        }

      })
      this.stepperService.toStep.pipe(takeWhile(r => this.isAlive)).subscribe(res => {
        const stepperLength = this.config?.length
        let steps: number[]
        if (res >= 0) {
          steps = range(this.selectedIndex, res)
        } else {
          steps = range(this.selectedIndex, stepperLength + res)
        }
        if (steps?.[0] === Math.max(...steps)) {
          steps?.forEach(i => {
            this.cdkStepper.previous()
          })
        } else {
          steps?.forEach(i => {
            this.cdkStepper.next()
          })
        }
      })
      this.stepperService.disableStep.pipe(takeWhile(r => this.isAlive)).subscribe(steps => {
        if (steps === true) {
          this.config.forEach(i => i.disable = true)
        }
        else if (!steps) {
          this.config.forEach(i => i.disable = false)
        }
        else if (Array.isArray(steps)) {
          this.config.forEach((i, index) => i.disable = !(steps?.includes(index) || steps?.includes(i?.title)))
        } else if (typeof steps === 'object') {
          Object.keys(steps || {}).forEach(i => {
            this.config[Number(i)].disable = steps?.[i]
          })
        }
        this.cd.markForCheck()
      })
      this.stepperService.disableForm.pipe(takeWhile(r => this.isAlive)).subscribe(disable => {
        if (disable) {
          this.form.setErrors({ ...this.form.errors, 'incorrect': true })
        } else {
          const { errors } = this.form
          delete errors?.['incorrect']
          this.form.setErrors(this.form.errors)
        }
      })
    }
  }

  private extractErrors(controls: { [key: string]: AbstractControl }): number {
    const controlsNames = Object.keys(controls);
    let errors = 0;
    for (let index = 0; index < controlsNames.length; index++) {
      const controlsName = controlsNames[index];
      const control = controls[controlsName];
      if (control instanceof FormGroup) {
        // let innerControls = control.controls;
        errors += this.extractErrors(control.controls);
      }
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
      !control.valid && errors++
    }
    return errors;
  }

  public stepChanged(step: number, selectedIndex: number) {
    this.selectedInd = selectedIndex;
    this.useStepperService && this.stepperService.stepChanged.next(selectedIndex);
    if (!!this.config[step]) {
      let controls = (this.form.controls['forms'].controls[step + ''] as FormGroup)?.controls;
      let controlsNames = Object.keys(controls);
      let errors = 0;
      for (let index = 0; index < controlsNames.length; index++) {
        const controlsName = controlsNames[index];
        if (!this.config[step].group.some((c) => c.config.name == controlsName && c.config.type == 'hidden')) {
          const control = controls[controlsName];
          if (control instanceof FormGroup) {
            // let innerControls = control.controls;
            errors += this.extractErrors(control.controls);
          } else {
            control.markAsDirty();
            control.markAsTouched();
            control.updateValueAndValidity();
            control.invalid && errors++
          }
        }
      }
      this.stepErrors[step] = errors;
    }
  }

  public handleSubmit(evt: any) {
    this.form.updateValueAndValidity();

    if (this.form.valid && !!this.submit) {
      this.onSubmit.emit(this.form.getRawValue());
    }
  }


  public submit() {
    this.submitBtn?.nativeElement.click();
  }
}
