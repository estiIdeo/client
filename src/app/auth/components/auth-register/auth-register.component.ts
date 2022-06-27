import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs/operators';
import { BaseFormComponent } from '@app/@core/base/base-form-component';

@Component({
  selector: 'prx-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss'],
})
export class AuthRegisterComponent extends BaseFormComponent implements OnInit {
  longArrowAltRight = faLongArrowAltRight;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    super();
    this.createForm();
  }

  ngOnInit() {}

  register() {
  }

  private createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
}
