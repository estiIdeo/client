import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from '@core';
import { AlertModel } from '../../../../@shared/models/alert.model';
import { AgencyAlertsService } from '../../../../content/agencies/components/agency-alrets/agency-alerts.service';
import { AccountService } from '../../../../@shared/services/account.service';
import { LazyLoadEvent } from '../../../../@ideo/components/table/events/lazy-load.event';
import { AlertSubject } from '../../../../@shared/interfaces/alert-subject.enum';
import { MatchMode } from '@app/@ideo/components/table/models/table-filter';
import { interval } from 'rxjs';
import { untilDestroyed } from '../../../../@core/until-destroyed';
import { switchMap, tap, finalize, shareReplay, startWith, takeUntil, takeWhile } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'prx-header-menu-notifications',
  templateUrl: './header-menu-notifications.component.html',
  styleUrls: ['./header-menu-notifications.component.scss'],
})
export class HeaderMenuNotificationsComponent extends BaseComponent implements OnInit {
  protected loaded: boolean = false;
  public loadMore: boolean = false
  @Input() isRtl: boolean
  @Input() isMobile: boolean

  iconClose = faTimes;
  alerts: AlertModel[] = [];

  
  public get isFleetUser() : boolean {
    return this.accountService.isFleetUser;
  }
  

  public evt: LazyLoadEvent<AlertModel> = { sorts: ['updated'], sortDirection: 'desc', page: 1, pageSize: 10 }

  alertIcon(alertSubject: AlertSubject) {
    return AlertSubject[alertSubject]?.match(/[A-Z][a-z]+/g).map(i => i.toLowerCase()).join('-')
  }

  alertTime(date: Date & string) {
    let delta = Math.abs(new Date().getTime() - Date.parse(date.toString())) / 1000;
    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    if (!!days) {
      if (days > 30) return Math.floor(days / 30) + ' mount ago'
      else if (days > 7) return Math.floor(days / 7) + ' week ago'
      return days + ' days ago'
    }
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    if (!!hours) return hours + ' hours ago'
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    if (!!minutes) return minutes + ' minutes ago'
    // delta -= minutes * 60;
    // what's left is seconds
    return 'just now'
  }



  constructor(
    private alertsService: AgencyAlertsService,
    private accountService: AccountService
    , private cd: ChangeDetectorRef) {
    super();
    this.alertsService.alertsReadEvent.pipe(untilDestroyed(this), takeUntil(this.destroyed), takeWhile(x => this.isAlive)).subscribe((id: number) => {
      const index = this.alerts.findIndex(i => i.id === id)
      index >= 0 && this.alerts.splice(index, 1, { ...this.alerts[index], isRead: true })
    })
    interval(400 * environment.alertsInterval).pipe(
      startWith(0),
      untilDestroyed(this),
      takeUntil(this.destroyed),
      takeWhile(x => this.isAlive),
      tap(() => this.loadMore = true),
      switchMap(x => this.alertsService.getAll(this.partnerId, { ...this.evt, filters: { ...this.evt.filters, 'created': { value: this?.alerts?.[0]?.created, matchMode: MatchMode.After } } } as LazyLoadEvent<AlertModel>)),
      finalize(() => { this.loadMore = false; this.isLoading = false }),
      shareReplay(1),
    ).subscribe((res) => {
      // console.log(res.data?.map(i => i.entityType)?.removeDuplicate())
      this.loadMore = false;
      const length = this.alerts?.length || 10
      this.alerts?.unshift(...res?.data)
      this.alerts?.removeDuplicateByKey('id')
      this.alerts?.slice(0, length)
      this.cd.markForCheck()
    })
  }

  public get billing(): boolean {
    return !!this.alerts?.filter(i => !i?.isRead)?.length
  }

  ngOnInit() { }

  public get partnerId(): number {
    if (!!!this.accountService?.partnerId) {
      console.log(
        this.accountService.selectedPartnerFleetObj?.partnerId, this.accountService.partnerFleetIds, this.accountService.user?.partnerId
      )
    }
    return this.accountService?.partnerId
  }

  more() {
    this.loadMore = true
    this.evt.page++
    this.updateAlerts()
  }

  updateAlerts() {
    this.alertsService.getAll(this.partnerId, this.evt).toPromise().then((alerts) => {
      this.isLoading = false;
      this.loadMore = false
      this.alerts = [...this.alerts, ...alerts.data].removeDuplicateByKey('id');
      // console.log(this.alerts ?.map(i => i.entityType)?.removeDuplicate())
    }).catch(err => this.loadMore = false);
  }

  onOpenChange(status: boolean) {
    if (status && !this.loaded) {
      this.loaded = !this.loaded;
      this.updateAlerts()
    }
  }

  public getAlertSubjectTypeName(type: number) {
    return `WSI.Core.Types.Enums.AlertSubject.${AlertSubject[type]}`
  }
}
