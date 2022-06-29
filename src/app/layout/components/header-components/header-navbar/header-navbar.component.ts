import { Component, OnInit, Input, HostBinding, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BaseComponent } from '@core';
import { NavigationService } from '@app/layout/services/navigation.service';
import { NavigationOptions } from '@app/layout/models/navigation';
import { untilDestroyed } from '../../../../@core/until-destroyed';

@Component({
  selector: 'prx-header-navbar',
  templateUrl: './header-navbar.component.html',
  styleUrls: ['./header-navbar.component.scss'],
})
export class HeaderNavbarComponent extends BaseComponent implements OnInit, OnDestroy {
  navGroups: NavigationOptions[] = [];

  @HostBinding('class.collapsed')
  @Input()
  sidenavCollapsed: boolean;

  @Input() isRtl: boolean;
  @Input() isMobile: boolean;


  @Output()
  sideNavToggled: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private navigation: NavigationService,
  ) {
    super('header-navbar');
  }

  ngOnDestroy() { }
  ngOnInit() {
    this.navigation.getNavigationItems().pipe(untilDestroyed(this)).subscribe((groups) => this.navGroups = groups)
    this.navigation.setNavigationItems()
  }

  toggleSidenav() {
    this.sidenavCollapsed = !this.sidenavCollapsed;
    this.sideNavToggled.emit(this.sidenavCollapsed);
  }
}
