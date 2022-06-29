// import { Component, OnInit, HostBinding, Input, Output, EventEmitter, HostListener } from '@angular/core';
// import { AuthenticationService, Logger } from '@core';
// import { Router } from '@angular/router';
// import { faInbox, faLock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import { NavigationService } from '@app/layout/services/navigation.service';
// import { NavigationOptions } from '@app/layout/models/navigation';

// const logger = new Logger('SidenavComponent');

// @Component({
//   selector: 'prx-sidenav',
//   templateUrl: './sidenav.component.html',
//   styleUrls: ['./sidenav.component.scss'],
//   host: { class: 'sidenav' },
// })
// export class SidenavComponent implements OnInit {
//   @HostBinding('class.fixed')
//   @Input()
//   fixed: boolean;

//   @HostBinding('class.hover')
//   hover: boolean;

//   @HostListener('mouseenter')
//   onMouseOver() {
//     this.hover = true;
//   }

//   @HostListener('mouseleave')
//   onMouseLeave() {
//     this.hover = false;
//   }

//   user: any = {
//     avatar: {
//       picture: 'https://randomuser.me/api/portraits/med/women/96.jpg',
//       name: 'pauline myers',
//       status: 'online',
//     },
//     info: 'paulinemyers@example.com',
//   };

//   icons = {
//     faInbox,
//     faLock,
//     faSignOutAlt,
//   };

//   navGroups: NavigationOptions[];

//   @Output()
//   sideNavToggled: EventEmitter<boolean> = new EventEmitter<boolean>();

//   @HostBinding('class.collapsed')
//   @Input()
//   collapsed: boolean;

//   constructor(private navigation: NavigationService, private authenticationService: AuthenticationService) { }

//   ngOnInit() {
//     //  TODO remove this page
//     this.navigation.getNavigationItems().subscribe((groups) => (this.navGroups = groups));
//   }

//   toggleSidenav() {
//     this.collapsed = !this.collapsed;
//     this.sideNavToggled.emit(this.collapsed);
//   }

//   logout() {
//     this.authenticationService.logout(true);
//   }

//   onNavLinkToggle(isOpen: boolean) {
//     logger.debug(`Nav link toggled ${isOpen}`);
//   }
// }
