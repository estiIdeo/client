import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { first, timeout, takeWhile, tap, distinctUntilChanged } from 'rxjs/operators';
import { StepFormGroup, StepFormGroupGetRawValue } from '../../../@shared/models/wizard-form.config';
import { range } from 'lodash';
import { untilDestroyed } from '../../../@core/until-destroyed';

@Injectable({
  providedIn: 'root'
})
export class StepperService implements OnDestroy {
  ngOnDestroy(): void {
    // this.form = undefined
    // this.entityId = undefined
  }
  /**
  * Negative number will take you to x step from the end / last = -1
  * Positive number will take you to x step from the start / first = 0
  */
  public toStep: Subject<number> = new Subject<number>()

  /**
  * Negative number will take you to previews steppes.
  * Positive number will take you to next steppes.
  */
  public relativeStep: Subject<number> = new Subject<number>()

  /**
  * true to disable all.
  * null | false to enable all.
  * { [step number] : boolean } to set enable and disable.
  * Array to disable all expat you can send either the step number or step title.
  */
  public disableStep: Subject<({ [key: number]: boolean } | (number | string)[]) | boolean> = new Subject<({ [key: number]: boolean } | (number | string)[]) | boolean>()

  /**
  * True will disable the form.
  * False will undo the disable if any.
  */
  public disableForm: Subject<boolean> = new Subject<boolean>();

  /**
  * Current Step
  */
  public currentStep: number;

  /**
  * Event to listen to the wizard step
  */
  public stepChanged: Subject<number> = new Subject<number>()


  public next = () => this.relativeStep.next(1)
  public prev = () => this.relativeStep.next(-1)
  public toFirst = () => this.toStep.next(0)
  public toLast = () => this.toStep.next(-1)
  public enableAll = () => this.disableStep.next(null)
  /**
  * Negative number will take you to previews steppes.
  * Positive number will take you to next steppes.
  * this jump you to the wished step with delay if there was change with the step number it will break
  * if you will like to jump one and in the mind time you go by the steps it will ignore the jump request
  */
  public stepToRelativeStepWithDelay(relativeStep: number, delay: number = 2000): Observable<number> {
    let jumpToStep = true
    setTimeout(() => {
      if (!!jumpToStep) {
        jumpToStep = false
        this.relativeStep.next(relativeStep)
      }
    }, delay)
    this.stepChanged.pipe(
      first(),
      takeWhile(x => !!jumpToStep),
      timeout(delay)
    ).subscribe(() =>
      jumpToStep = false
    )
    return this.stepChanged
  }

  public disableTo = (relativeStepOrAbsoluteStep: number, isAbsolute?: boolean /** else he is relative */): void => {
    if (isAbsolute) {
      this.disableStep.next(range(0, relativeStepOrAbsoluteStep))
    } else {
      this.disableStep.next(range(0, this.currentStep + relativeStepOrAbsoluteStep + 1))
    }
  }
  public entityId: number;
  public form: StepFormGroup;
  public get formValues(): StepFormGroupGetRawValue {
    return this.form?.getRawValue()
  }
  public findFormArrFormControl = (title: string): FormControl => this?.form?.controls.forms?.controls?.find((f) => !!f?.controls?.[title])?.controls?.[title];
  public findFormArrayValuesObject = (title: string, formValues: StepFormGroupGetRawValue = this.formValues): any => formValues.forms?.find((f: any) => !!f?.[title])?.[title];
  public findFormArrayControlIndex = (title: string): number => this?.form?.controls.forms?.controls?.findIndex((f) => !!f?.controls?.[title])
  constructor() { this.stepChanged.pipe(untilDestroyed(this), distinctUntilChanged(), tap(s => this.currentStep = s)).subscribe() }
}
