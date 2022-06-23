import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { PageFormConfig } from '../../models/edit-form.config';
import { TagFormService } from './tag-form.service';

@Injectable({
  providedIn: 'root'
})
export class TagFormResolver implements Resolve<PageFormConfig> {


  constructor(private _tagFormService:TagFormService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PageFormConfig {
    const titleEmitter$: Subject<string> = new Subject<string>();
    titleEmitter$.next("aaaaa");
    const pageConfig: PageFormConfig = {
      title$: titleEmitter$,
      groupConfig: {
        controls: this._tagFormService.generate(),
      },
    /*  submit: (model: any) => {

        //  return this.paymentPlansService.create(model);
        
      },*/
    }as PageFormConfig;
    return pageConfig;
  }
}
