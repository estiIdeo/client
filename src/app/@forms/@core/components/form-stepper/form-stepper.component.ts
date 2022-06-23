import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { Directionality } from '@angular/cdk/bidi';


@Component({
  selector: 'ideo-form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: CdkStepper, useExisting: FormStepperComponent }],
})
export class FormStepperComponent extends CdkStepper implements OnInit {
  constructor(ref: ChangeDetectorRef, dir: Directionality) {
    super(dir, ref);
  }

  @Input() public activeClass = 'active';
  @Input() public inactiveClass = '';
  @Input() public bodyClass = '';



  ngOnInit(): void {

  }

  public isNextButtonHidden() {
    return !(this.steps.length === this.selectedIndex + 1);
  }
}
