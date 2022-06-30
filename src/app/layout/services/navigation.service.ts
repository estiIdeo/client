import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, forkJoin, Subject } from 'rxjs';
import {
  faLayerGroup,
  faTools,
  faLowVision,
  faUsersCog,
  faUserPlus,
  faCar,
  faUserTag,
  faMicrophone,
  faLanguage,
  faAmericanSignLanguageInterpreting,
  faCog,
  faUserSecret,
  faKeyboard,
  faGlobe,
  faWallet,
  faStar,
  faUsers,
  faInfo,
  faThList,
  faCarSide,
  faBarcode,
  // faBook,
  faList,
  faCaravan,
  faFire,
} from '@fortawesome/free-solid-svg-icons';

import { NavigationOptions } from '../models/navigation';
import { Permission } from '../../@ideo/infrastructure/permissions/permission';
import { AccountService } from '../../@shared/services/account.service';
import { map, switchMap, tap, filter, skip, take } from 'rxjs/operators';
import { AcronymPipe } from '../../@ideo/infrastructure/pipes/acronym.pipe';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../environments/environment';
import { untilDestroyed } from '../../@core/until-destroyed';
import { Router } from '@angular/router';
import { MatchMode } from '../../@ideo/components/table/models/table-filter';
import { FilterObject } from '../../@ideo/components/table/events/lazy-load.event';
import { RolesType } from '../../@shared/types/role.type';
import { MAX_INT } from '../../@ideo/components/table/table.component';
import { AutoTagType } from '../../@shared/models/tags.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService implements OnDestroy {
  constructor(
    private accountService: AccountService,
    private acronymPipe: AcronymPipe,
    private router: Router // private translate: TranslatePipe
  ) {}
  ngOnDestroy(): void {}
  public cleanNavigationItems(): void {
    this.navigationItems = null;
  }

  private navigationItems: NavigationOptions[] = null;
  private permissionArray: string[];

  private get roles(): RolesType[] {
    return this.accountService.roles;
  }
  setNavigationItems(): void {
    this.generateMenu()
      ?.pipe(take(1), untilDestroyed(this))
      .subscribe((items) => {
        this.navigationItems$.next(items);
      });
  }
  private get permmisionByRole() {
    this.permissionArray = [];
    for (const [key, value] of Object.entries(this.accountService.permissions)) {
      if (value.findIndex((x) => x == this._myRole) > -1) {
        this.permissionArray.push(key);
      }
    }
    return;
  }

  private _myRole: string;
  private set myRole(val: string) {
    this._myRole = val;
  }
  private get role(): RolesType {
    for (let i of this.roles) {
      // debugger
      switch (i) {
        case 'Admin':
          return i;
        case 'PartnerAdmin':
          return i;
        default:
          break;
      }
    }
  }

  public navigationItems$: Subject<NavigationOptions[]> = new Subject<NavigationOptions[]>();

  getNavigationItems(): Observable<NavigationOptions[]> {
    return this.navigationItems$;
  }
  private generateMenu(): Observable<NavigationOptions[]> {
    switch (this.role) {
      case 'Admin':
        this.myRole = 'Admin';
        return;
      case 'PartnerAdmin':
        this.myRole = 'PartnerAdmin';
        return;
      default:
        return ;
    }
  }

}
