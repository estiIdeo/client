import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { BaseComponent } from '@core';
import { ContactFormModel, ContactUsTypeEnum } from '../../../../@shared/models/contact-form.model';
import { LazyLoadEvent } from '../../../../@ideo/components/table/events/lazy-load.event';
import { AccountService } from '../../../../@shared/services/account.service';
import { interval } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { startWith, tap, switchMap, finalize, shareReplay, takeUntil, takeWhile } from 'rxjs/operators';
import { untilDestroyed } from '../../../../@core/until-destroyed';
import { ContactFormsService } from '../../../../content/agencies/components/contact-forms/contact-forms.service';
import { MatchMode } from '../../../../@ideo/components/table/models/table-filter';
import { UsersService } from '@app/content/users/services/users.service';
import { PickModel } from '@app/@shared/components/modal-assign-page/pick.model';
import { UserModel } from '../../../../@shared/models/user.model';

type entityType = ContactFormModel
@Component({
  selector: 'prx-header-menu-messages',
  templateUrl: './header-menu-messages.component.html',
  styleUrls: ['./header-menu-messages.component.scss'],
})
export class HeaderMenuMessagesComponent extends BaseComponent implements OnInit {
  protected loaded: boolean = false;
  public loadMore: boolean = false

  @Input() isRtl: boolean
  @Input() isMobile: boolean

  iconClose = faTimes;
  entities: entityType[] = [];

  public evt: LazyLoadEvent<entityType> = {
    sorts: ['created'], sortDirection: 'desc', page: 1, pageSize: 10, filters: {
      type: {
        matchMode: MatchMode.Equals,
        value: ContactUsTypeEnum.Form
      }
    }
  }

  daleyTime(date: Date & string) {
    let delta = Math.abs(new Date().getTime() - Date.parse(date.toString())) / 1000;
    {
      // calculate (and subtract) whole days
      let days = Math.floor(delta / 86400);
      if (!!days) {
        if (days > 30) return Math.floor(days / 30) + ' mount ago'
        else if (days > 7) return Math.floor(days / 7) + ' week ago'
        return days + ' days ago'
      }
      delta -= days * 86400;
    }
    {
      // calculate (and subtract) whole hours
      let hours = Math.floor(delta / 3600) % 24;
      if (!!hours) return hours + ' hours ago'
      delta -= hours * 3600;
    }
    {
      // calculate (and subtract) whole minutes
      let minutes = Math.floor(delta / 60) % 60;
      if (!!minutes) return minutes + ' minutes ago'
      delta -= minutes * 60;
    }
    // what's left is seconds
    return 'just now'
  }

  messageType(type: ContactUsTypeEnum) {
    return ContactUsTypeEnum?.[type]
  }

  public usersPicks: { [id: string]: PickModel } = {}

  getPick = (entity: entityType, pickEntity?: UserModel): PickModel => {
    switch (entity?.type) {
      case ContactUsTypeEnum.Form:
        if (!!entity?.userId) {
          let pick = this.usersPicks?.[entity?.userId]
          const { name, request } = entity;
          if (!pick && pickEntity) {
            const user = pickEntity as UserModel
            const { profileImageId, firstName, lastName, id, userName } = user
            this.usersPicks[entity?.userId] = {
              id: id,
              img: profileImageId,
              name: firstName + ' ' + lastName,
              colorHash: userName,
            }
            pick = this.usersPicks?.[entity?.userId]
          }
          if (pick) {
            return {
              ...pick,
              detailsArr: [{ text: request }], title: name,
            }
          }
        }
    }
  }

  constructor(
    private entityService: ContactFormsService,
    private accountService: AccountService,
    private cd: ChangeDetectorRef,
    private usersService: UsersService,
  ) {
    super();
    interval(400 * environment.alertsInterval).pipe(
      startWith(0),
      untilDestroyed(this),
      takeUntil(this.destroyed),
      takeWhile(x => this.isAlive),
      tap(() => this.loadMore = true),
      switchMap(x => this.entityService.getAll(this.partnerId, { ...this.evt, filters: { ...this.evt.filters, 'created': { value: this?.entities?.[0]?.created, matchMode: MatchMode.After } } } as LazyLoadEvent<entityType>)),
      finalize(() => { this.loadMore = false; this.isLoading = false }),
      shareReplay(1),
    ).subscribe((res) => {

      const length = this.entities?.length || 10
      this.loadMore = false;
      if (!!this.entities?.length && res?.data?.length) {
        this.newEntitiesCount = res?.data?.length
      }

      this.handleNewEntities(res?.data)

      this.entities?.unshift(...res?.data)
      this.entities?.removeDuplicateByKey('id')
      this.entities?.slice(0, length)
      this.cd.markForCheck()
    })
  }

  public newEntitiesCount: number

  ngOnInit() { }

  public get partnerId(): number {
    return this.accountService?.partnerId
  }

  more() {
    this.loadMore = true
    this.evt.page++
    this.updateEntities()
  }

  private handleNewEntities(entities: entityType[]) {
    const newEntitiesWithoutPicker = entities?.filter(i => !this.getPick(i))
    const newEntitiesWithoutPickerIds = newEntitiesWithoutPicker?.map(i => i?.userId)

    if (!!newEntitiesWithoutPickerIds?.length) {
      this.usersService.getAll({
        filters: {
          id: {
            matchMode: MatchMode.Equals,
            value: newEntitiesWithoutPickerIds,
          }
        }
      })?.toPromise().then(res => {
        newEntitiesWithoutPicker?.forEach(i => this.getPick(i, res?.data?.find(f => f?.id === i?.userId)))
        this.cd.markForCheck()
      })
    }
  }

  updateEntities() {
    this.entityService.getAll(this.partnerId, this.evt).toPromise().then((entities) => {
      this.isLoading = false;
      this.loadMore = false
      this.handleNewEntities(entities?.data)
      this.entities = [...this.entities, ...entities.data].removeDuplicateByKey('id');
    }).catch(() => this.loadMore = false);
  }

  onOpenChange(status: boolean) {
    if (status && !this.loaded) {
      this.loaded = !this.loaded;
      this.updateEntities()
    }
  }
}
