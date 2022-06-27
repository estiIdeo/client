import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupConfig, PageFormConfig } from '@app/@shared/models/edit-form.config';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { BaseComponent } from '../../../@core/base/base-component';
import { Location } from '@angular/common';
import { untilDestroyed } from '../../../@core/until-destroyed';

@Component({
  selector: 'prx-form-paged',
  templateUrl: './form-paged.component.html',
  styleUrls: ['./form-paged.component.scss'],
})
export class FormPagedComponent extends BaseComponent {
  constructor(
    private route: ActivatedRoute,
    private locationService: Location,
  ) {
    super();
    this.route.data.pipe(untilDestroyed(this), take(1)).subscribe((data: { config: PageFormConfig }) => {
      this.config = data.config;
      this.title = data.config.title;
      const id = this.route.snapshot.paramMap.get('id');
      if (!!id && id !== 'create' && !isNaN(+id)) {
        this.loading = true;
        data.config
          .getEntityById(+id)
          .pipe(catchError((err) => of(null)))
          .toPromise()?.then(entity => {
            if (!!entity) {
              if (!!this.formInstance && !!this.formInstance.patchValue) {
                this.formInstance.patchValue(entity);
              }
              if (!!data.config.modifyOnEdit) {
                data.config.modifyOnEdit(this.groupConfig, this.formInstance, entity);
              }
              this.isEdit = true;
            } else {
              this.locationService.back();
            }
          }).finally(() => this.loading = false)
      }

      if (!!data.config?.appendControl$) {
        data.config.appendControl$?.pipe(untilDestroyed(this)).subscribe((res: any) => {
          const appender = this.groupConfig.controls[this.groupConfig.controls.length - 1];
          this.groupConfig.controls = [
            ...this.groupConfig.controls.slice(0, this.groupConfig.controls.length - 2),
            ...res,
            appender,
          ];
        });
      }
    });
  }
  public title: string;
  public groupConfig: GroupConfig;
  public formInstance: FormGroup = {} as FormGroup;
  public isEdit: boolean = false;
 // public breadcrumbs: BreadcrumType[] = [];
  public loading: boolean;
  public submit: (values: any) => Observable<any>;

  public set config(config: PageFormConfig) {
    if (!!config) {
      config.title$?.pipe(untilDestroyed(this)).subscribe((res) => {
        this.title = res;
      });
      //this.breadcrumbs = config.breadcrumbs;
      this.groupConfig = config.groupConfig;
      if (!!config.groupConfig$) {
        config.groupConfig$?.pipe(untilDestroyed(this)).subscribe((groupConfig) => {
          this.groupConfig = groupConfig;
        });
      }
      this.submit = config.submit;
    }
  }

  public submitForm(values?: any) {
    if ((!!this.formInstance?.valid) && !!this.submit) {
      this.loading = true
      this.formInstance.setErrors({ incorrect: true })
      this.submit(values || this.formInstance?.getRawValue())
        ?.toPromise()?.then(res => {
          !!res && this.locationService.back();
        })
        ?.finally(() => { this.formInstance.setErrors(null); this.loading = false });
    }
  }
}
