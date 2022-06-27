import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GroupConfig, PageFormConfig } from '@app/@shared/models/edit-form.config';
import { untilDestroyed } from '../../../@core/until-destroyed';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss']
})
export class TagFormComponent implements OnInit {

  public groupConfig: GroupConfig;
  public title: string;
  public set config(config: PageFormConfig) {
    if (!!config) {
      config.title$?.pipe(untilDestroyed(this)).subscribe((res) => {
        this.title = res;
      });
      this.groupConfig = config.groupConfig;
      if (!!config.groupConfig$) {
        config.groupConfig$?.pipe(untilDestroyed(this)).subscribe((groupConfig) => {
          this.groupConfig = groupConfig;
        });
      }
    }
  }
  constructor( private fb: FormBuilder) { }

  ngOnInit(): void {
  
  }




}
