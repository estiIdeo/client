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
import { map, tap, filter, skip, take } from 'rxjs/operators';
import { AcronymPipe } from '../../@ideo/infrastructure/pipes/acronym.pipe';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { untilDestroyed } from '../../@core/until-destroyed';
import { Router } from '@angular/router';

import { RolesType } from '../../@shared/types/role.type';
import { MAX_INT } from '../../@ideo/components/table/table.component';


@Injectable({
  providedIn: 'root',
})
export class NavigationService implements OnDestroy {
  constructor(
    private accountService: AccountService,
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

  private get permmisionByRole() {
    this.permissionArray = [];
    for (const [key, value] of Object.entries(this.accountService.permissions)) {
      if (value.findIndex((x) => x == this._myRole) > -1) {
        this.permissionArray.push(key);
      }
    }
    return;
  }
  private fleetRoute() {
    return '/fleets/my/profile/';
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
        case 'FleetManager':
          return i;
        default:
          break;
      }
    }
  }

  private get parentId(): number {
    switch (this.role) {
      case 'Admin':
      case 'PartnerAdmin':
        return this.accountService.partnerId;
      default:
        return this.accountService.partnerId;
        break;
    }
  }

  public navigationItems$: Subject<NavigationOptions[]> = new Subject<NavigationOptions[]>();

  setNavigationItems(): void {
    this.generateMenu()
      ?.pipe(take(1), untilDestroyed(this))
      .subscribe((items) => {
        this.navigationItems$.next(items);
      });
  }

  getNavigationItems(): Observable<NavigationOptions[]> {
    return this.navigationItems$;
  }

  // public switchAgency(): NavigationOptions[] {
  //   const partnerId = this.accountService.partnerId;
  //   let defaultPartner: PartnerModel;
  //   if (!!partnerId) {
  //     defaultPartner = this.partners.find((i) => i.id === +partnerId);
  //   } else {
  //     defaultPartner = this.partners?.[0];
  //   }
  //   return [
  //     {
  //       title: 'Portal.Navigation.WsiPlatform.Agency.Switch',
  //       style: 'border bold',
  //       items: [
  //         ...this.partners?.map((m) => {
  //           return {
  //             title: m.name,
  //             data: {
  //               id: m.id,
  //             },
  //             click: (item: NavigationOptions) => {
  //               this.accountService.selectedPartnerFleet = { [item?.data?.id]: 0 };
  //             },
  //             link: `agencies/${m.id}/profile`,
  //             icon: { letter: this.acronymPipe.transform(m.name.split(' ')), size: 'sm' },
  //           } as NavigationOptions;
  //         }),
  //       ],
  //     },
  //   ];
  // }

  // private generateAdminMenu(): Observable<NavigationOptions[]> {
  //   return forkJoin([
  //     this.partnersService.getAll({}).pipe(tap((x) => (this.partners = x.data))),
  //     this.fleetsService
  //       .getAll(this.accountService.partnerId, { page: 1, pageSize: MAX_INT })
  //       .pipe(tap((x) => (this.fleets = x.data))),
  //   ]).pipe(
  //     map(() => {
  //       return this.adminItems();
  //     })
  //   );
  // }
  private  partnerAdminItems(): NavigationOptions[] {
    return <NavigationOptions[]>[
      {
        title: 'Portal.Navigation.Dashboard',

        link: '/home',
        permission: { values: ['AccessAdminPanel'] } as Permission,
      },
    /*  {
        title: 'Portal.Navigation.Agencies',

        permission: { values: ['AccessAgencies'] } as Permission,
        items: [
          {
            title: 'Portal.Navigation.Agencies.ListView',
            link: '/agencies',
            permission: { values: ['AccessAgencies'] } as Permission,
          },
          {
            title: 'Portal.Navigation.Agencies.Agencies',
            permission: { values: ['AccessAgencies'] } as Permission,

            items: this.partners?.map((i) => {
              // console.log(this.partnerAgencyResolverService.sidebarItems.map(x=>x.permission))
              return {
                title: i?.name,
                link: `/agencies/${i?.id}/profile`,
                permission: { values: ['AccessAgencies'] } as Permission,
                items: this.partnerAgencyResolverService.sidebarItems
                  .filter((t) => t.permission?.values.findIndex((r) => r == 'AccessAgencies') > -1)
                  .map((x) => {
                    return {
                      title: x.label,
                      // title: this.translate.transform(x.label),
                      permission: { values: ['AccessAgencies'] } as Permission,
                      icon: { name: x.icon },
                      link: `/agencies/${i?.id}/profile/${x.value}`,
                    } as NavigationOptions;
                  }),
              };
            }),
          },
        ],
      },
      {
        title: 'Portal.Navigation.Fleets',
        items: [
          {
            title: 'Portal.Navigation.Fleets.ListView',
            icon: { name: faList },
            link: `/agencies/${this.parentId}/profile/fleets`,
            permission: { values: ['AccessAgencies'] } as Permission,
          },
          {
            title: 'Portal.Navigation.Fleets.Current',
            icon: { name: faStar },
            permission: { values: ['AccessAgencies'] } as Permission,
            link: this.fleetRoute(),
          },
          ...this.fleets?.map((i) => ({
            title: i?.name,
            link: `/agencies/${this.parentId}/fleets/${i.id}/profile/summary`,
            items: this.fleetResolverService.sidebarItems(i).map(
              (x) =>
                ({
                  title: x.label,
                  permission: x.permission,
                  icon: { name: x.icon },
                  link: `/agencies/${this.accountService.partnerId}/fleets/${i.id}/profile/${x.value}`,
                } as NavigationOptions)
            ),
          })),
        ],
      },
      {
        title: 'Portal.Navigation.WsiPlatform.General.Bookings',
        permission: { values: ['AccessBookings'] } as Permission,
        items: [
          {
            title: 'Portal.Navigation.WsiPlatform.General.Bookings.CreateBooking',
            icon: { name: faPlus },
            link: '/booking/create',
            permissions: { values: ['EditBooking', 'CreateBookings'] } as Permission,
          },
          {
            title: 'Portal.Navigation.WsiPlatform.General.Bookings.ListView',
            icon: { name: faList },
            link: '/booking',
            permissions: { values: ['AccessBookings'] } as Permission,
          },
        ],
      },

      {
        title: 'Portal.Navigation.B2C',
        permission: { values: ['AccessAgencies'] } as Permission,
        link: '/users/b2c',
      },
      {
        title: 'Portal.Navigation.B2B',
        permission: { values: ['AccessAgencies'] } as Permission,
        link: '/users/b2b',
      },
      {
        title: 'Portal.Navigation.Reports',
        permission: { values: ['AccessAgencies'] } as Permission,
        link: `/agencies/${this.parentId}/profile/reports`,
      },*/
      // {
      //
      //   title: 'Info',
      //   permissions: { roles: ['Admin'] } as Permission,
      //   items: [
      //     {
      //       icon: { name: faInfo },
      //       title: 'Api',
      //       click: () => window.open('http://130.61.26.101/docs/index.html#', '_blank'),
      //       permissions: { roles: ['Admin'] } as Permission,
      //     }
      //   ]
      // }
    ];
  }

  // private adminItems(): NavigationOptions[] {
  //   return <NavigationOptions[]>[
  //     {
  //       icon: { name: faStar },
  //       title: 'Portal.Navigation.WsiPlatform',
  //       title$: this.accountService.selectedPartnerFleetChanged.pipe(
  //         skip(1),
  //         filter((x) => !!x),
  //         map((x) => {
  //           const id = Object.keys(x)?.[0];
  //           return this.partners.find((p) => p.id === +id);
  //         }),
  //         map((x) => x.name)
  //       ),
  //     //  permission: { roles: ['Admin', 'PartnerAdmin'], values: ['AccessSettings'] } as Permission,
  //       items: [
  //         {
  //           title: 'Portal.Navigation.WsiPlatform.General.UserManagement',
  //           icon: { name: faUsersCog },
  //           link: '/users',
  //        //   permission: { values: ['AccessUsers'] } as Permission,
  //           items: [
  //             {
  //               icon: { name: faUserPlus },
  //               title: 'Portal.Navigation.WsiPlatform.General.UserManagement.CreateCustomer',
  //               link: '/users/create',
  //               //permission: { values: ['CreateUsers'] } as Permission,
  //             },
  //             {
  //               icon: { name: faUsers },
  //               title: 'Portal.Navigation.WsiPlatform.General.UserManagement.CustomerList',
  //               link: '/users',
  //              // permission: { values: ['CreateUsers'] } as Permission,
  //             },
  //           ],
  //         },
  //         {
  //           icon: { name: faMicrophone },
  //           title: 'Portal.Navigation.WsiPlatform.General.Logs',
  //           link: '/configuration/audit-logs',
  //          // permission: { roles: ['Admin'] } as Permission,
  //         },
  //         // {
  //         //   icon: { name: faWallet },
  //         //   title: 'Portal.Navigation.WsiPlatform.General.PaymentPlans',
  //         //   link: '/configuration/payment-plans',
  //         //   permission: { values: ['AccessPaymentPlans'] } as Permission,
  //         // },
  //         // {
  //         //   icon: { name: faCaravan },
  //         //   title: 'Portal.Navigation.WsiPlatform.TracCar.Mapping',
  //         //   link: '/configuration/trac-car',
  //         //   permission: { values: ['AccessPlatformCarModelConfiguration'] } as Permission,
  //         // },
  //         // {
  //         //   icon: { name: faFire },
  //         //   title: 'Portal.Navigation.WsiPlatform.ScheduledJobs.Title',
  //         //   link: '/configuration/scheduled-jobs',
  //         //   permission: { roles: ['Admin'] } as Permission,
  //         // },
  //         {
  //           icon: { name: faCar },
  //           title: 'Portal.Navigation.WsiPlatform.SearchCarConfig.Title',
  //           link: '/configuration/car-config',
  //           // permission: { roles: ['Admin'] } as Permission,
  //         },
  //         {
  //           icon: { name: faInfo },
  //           title: 'Portal.Navigation.WsiPlatform.VersionAppConfig.Title',
  //           link: '/configuration/version-app-config',
  //           // permission: { roles: ['Admin'] } as Permission,
  //         },
  //         {
  //           icon: { name: faBarcode },
  //           title: 'Portal.Navigation.WsiPlatform.General.SkuRanges',
  //           // permission: { values: ['AccessAdminPanel'] } as Permission,
  //           link: `/configuration/sku-ranges`,
  //         },
  //         {
  //           icon: { name: faKeyboard },
  //           title: 'Portal.Navigation.WsiPlatform.General.Templates',
  //           link: '/configuration/templates',
  //           // permission: { values: ['AccessSettings'] } as Permission,
  //         },

  //         //...this.switchAgency(),
  //       ],
  //     },
  //     {
  //       title: 'Portal.Navigation.Dashboard',

  //       link: '/home',
  //       //permission: { values: ['AccessAdminPanel'] } as Permission,
  //     }
  //   ];
  // }

  private generatePartnerAdminMenu(): Observable<NavigationOptions[]> {
   /* return this.fleetsService
      .getAll(this.accountService.partnerId, { page: 1, pageSize: MAX_INT, sortColumn: 'name', sortDirection: 'asc' })
      .pipe(
        tap((x) => {
          this.fleets = x.data;
          this._partners = x.data
            .map((t) => t.partner)
            .filter((that, index, self) => index === self.findIndex((t) => t.id === that.id));
          return x;
        }),
        map((s) => [
          ...(s.data
            .map((r, i) => {
              if (i == 0) {
                this.accountService.selectedPartnerFleet = this.accountService.selectedPartnerFleet || {
                  [this.accountService.partnerId]: r.id,
                };
                const defaultFleet =
                  (s.data.find(
                    (t) => this.accountService.selectedPartnerFleet?.[this.accountService.partnerId] == t.id
                  ) as any) || (r as any);
                let currentFleet: { fleetId: number; name: string } = {
                  name: defaultFleet.name,
                  fleetId: defaultFleet.id,
                };
                this.currentFleet = defaultFleet;
                return {
                  icon: { name:faStar },
                  title: 'Portal.Navigation.WsiPlatform',
                  data: {
                    fleetId: r.id,
                    name: r.name,
                  },
                 title$: this.accountService.selectedPartnerFleetChanged.pipe(
                    filter((x) => !!x),
                    switchMap((x) => {
                      let keys = Object.keys(x);
                      return of(this.fleets.find((f) => f.partnerId == Number(keys[0]) && f.id == x[keys[0]]));
                      // return this.fleetsService.get(Number(keys[0]), x[keys[0]]);
                    }),
                    map((x) => x),
                    tap((x) => {
                      currentFleet = { name: x.name, fleetId: x.id };
                      return x;
                    }),
                    map((x) => x.name)
                  ), 
                  permission: { roles: ['PartnerAdmin', 'CustomerServiceRepresentive'] } as Permission,
                  items: [
                    ...s.data?.map((m) => {
                      return {
                        title: 'Portal.Navigation.WsiPlatform',
                        data: {
                          fleetId: m.id,
                          name: m.name,
                        },
                        link: `agencies/${this.accountService.partnerId}/fleets/${m.id}/profile`,
                        icon: { name: faStar },
                      } as NavigationOptions;
                    }),
                    {
                      title: 'Portal.Navigation.Configuration',
                      icon: { name: faTools },
                      items: [
                        {
                          icon: { name: faKeyboard },
                          title: 'Portal.Navigation.WsiPlatform.General.Templates',
                          link: '/configuration/templates',
                          permission: { roles: ['Admin', 'PartnerAdmin', 'FleetManager'] } as Permission,
                        },
                        {
                          title: 'Portal.Navigation.WsiPlatform.General.UserManagement',
                          icon: { name: faUsersCog },
                          permission: { values: ['AccessUsers'] } as Permission,
                          items: [
                            {
                              icon: { name: faUserPlus },
                              title: 'Portal.Navigation.WsiPlatform.General.UserManagement.CreateCustomer',
                              link: '/users/create',
                              permission: { values: ['CreateUsers'] } as Permission,
                            },
                            {
                              icon: { name: faUserTag },
                              title: 'Portal.Navigation.WsiPlatform.General.UserManagement.CustomerList',
                              link: '/users',
                              permission: { values: ['CreateUsers'] } as Permission,
                            },
                          ],
                        },
                        {
                          icon: { name: faWallet },
                          title: 'Portal.Navigation.WsiPlatform.General.PaymentPlans',
                          link: '/configuration/payment-plans',
                          permission: { values: ['AccessPaymentPlans'] } as Permission,
                        },
                        {
                          icon: { name: faGlobe },
                          title: 'Portal.Navigation.WsiPlatform.General.Localization',
                          permission: { values: ['AccessLocalization'] } as Permission,
                          items: [
                            {
                              icon: { name: faLanguage },
                              title: 'Portal.Navigation.WsiPlatform.General.Localization.Language',
                              link: '/configuration/localization/languages',
                              permission: { values: ['AccessLocalization'] } as Permission,
                            },
                            {
                              icon: { name: faAmericanSignLanguageInterpreting },
                              title: 'Portal.Navigation.WsiPlatform.General.Localization.LocaleResource',
                              link: '/configuration/localization/locale-resources',
                              permission: { values: ['AccessLocalization'] } as Permission,
                            },
                          ],
                        },
                        {
                          icon: { name: faCog },
                          title: 'Portal.Navigation.WsiPlatform.General.Settings',
                          link: '/configuration/settings',
                          permission: { values: ['AccessSettings'] } as Permission,
                        },
                      ],
                    },
                  ],
                };
              }
              return null;
            })
            .filter((z) => !!z) as NavigationOptions[]),
        ]),
        tap((res) => {
          this.navigationItems = res;
        }),
        map((x) => x.concat(this.partnerAdminItems()))
      );*/

      return of(this.partnerAdminItems());
  }

  // public switchFleet(): NavigationOptions[] {
  //   if (!!this.fleets?.length) {
  //     return [
  //       {
  //         title: 'Portal.Navigation.Fleet.Switch',
  //         style: 'border bold',
  //         items: [
  //           ...this.fleets
  //             ?.filter((i) =>
  //               this.accountService.user.partnerFleetIds?.[this.accountService?.partnerId]?.includes(i?.id)
  //             )
  //             ?.map((m) => {
  //               return {
  //                 title: m.name,
  //                 data: {
  //                   id: m.id,
  //                 },
  //                 click: (item: NavigationOptions) => {
  //                   const partnerId = +Object.keys(this.accountService.partnerFleetIds)?.find((i) =>
  //                     this.accountService?.[i]?.includes(item?.data?.id)
  //                   );
  //                   this.accountService.selectedPartnerFleet = { [partnerId]: item?.data?.id };

  //                   this.router
  //                     .navigateByUrl('/', { skipLocationChange: true })
  //                     .then(() => this.router.navigate(this.fleetRoute()?.split('/')));
  //                 },
  //                 // link: `fleets/my/profile`,
  //                 icon: { letter: this.acronymPipe.transform(m.name.split(' ')), size: 'sm' },
  //               } as NavigationOptions;
  //             }),
  //         ],
  //       },
  //     ];
  //   } else {
  //     return [];
  //   }
  // }

  // private fleetManagerMenuItems(): NavigationOptions[] {
  //   return [
  //     {
  //       title: 'Portal.Navigation.Dashboard',

  //       link: '/home',
  //       permission: { values: ['AccessAdminPanel'] },
  //     },
  //     {
  //       title: 'Portal.Navigation.Fleets',
  //       // permission: { values: ['AccessAgencyVehicles'] } as Permission,
  //       items: [
  //         ...this.switchFleet(),
  //         ...this.fleetResolverService.sidebarItems(null).map(
  //           (x) =>
  //             ({
  //               title: x.label,
  //               permission: x.permission,
  //               icon: { name: x.icon },
  //               link: `/fleets/my/profile/${x.value}`,
  //             } as NavigationOptions)
  //         ),
  //       ],
  //     },
  //     {
  //       title: 'Portal.Navigation.WsiPlatform.General.Vehicles',
  //       link: '/fleets/my/profile/vehicles',
  //       permission: { values: ['AccessFleetVehicles'] } as Permission,
  //     },
  //     {
  //       title: 'Portal.Navigation.Customers',

  //       permission: { values: ['AccessUsers', 'AccessAgencyUsers'] },
  //       link: '/users',
  //       data: '',
  //       items: [
  //         {
  //           title: 'Portal.Navigation.B2C',

  //           permission: { values: ['AccessUsers', 'AccessAgencyUsers'] },
  //           link: '/users/b2c',
  //           data: '',
  //         },
  //         {
  //           title: 'Portal.Navigation.B2B',

  //           permission: { values: ['AccessUsers', 'AccessAgencyUsers'] },
  //           link: '/users/b2b',
  //         },
  //         {
  //           icon: { name: faUserPlus },
  //           title: 'Create customer',
  //           link: '/users/create',
  //           permission: { values: ['CreateUsers', 'EditUsers'] } as Permission,
  //         },
  //         // {
  //         //   icon: { name: faUsers },
  //         //   title: 'Customer list',
  //         //   link: '/users',
  //         //   permission: { values: ['AccessUsers'] } as Permission,
  //         // },
  //       ],
  //     },
  //     {
  //       title: 'Portal.Navigation.WsiPlatform.General.Bookings',

  //       permission: { values: ['AccessBookings'] },
  //       items: [
  //         {
  //           title: 'Portal.Navigation.WsiPlatform.General.Bookings.ListView',
  //           icon: { name: faThList },
  //           link: '/booking',
  //           permission: { values: ['AccessBookings'] },
  //         },
  //         {
  //           title: 'Portal.Navigation.WsiPlatform.General.Bookings.CreateBooking',
  //           icon: { name: faPlus },
  //           link: '/booking/create',
  //           permission: { values: ['AccessBookings', 'EditBookings', 'CreateBookings'] },
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Portal.Agencies.Sidebar.Leads',
  //       link: '/fleets/my/profile/leads',
  //       permission: { values: ['AccessLeads'] },
  //     },
  //     {
  //       title: 'Portal.Navigation.Contracts',
  //       link: '/fleets/my/profile/orders',
  //       permission: { values: ['AccessOrders'] },
  //     },
  //     {
  //       title: 'Portal.Navigation.Invoices',
  //       permission: { values: ['AccessInvoices'] },
  //       link: '/fleets/my/profile/invoices',
  //     },
  //     {
  //       title: 'Portal.Navigation.Communication',
  //       items: [
  //         {
  //           title: 'Portal.Fleets.Sidebar.Alerts',
  //           permission: { values: ['AccessAlerts'] },
  //           link: '/fleets/my/profile/alerts',
  //         },
  //         {
  //           title: 'Portal.Fleets.Sidebar.ContactForms',
  //           link: '/fleets/my/profile/contact-forms',
  //           permission: { values: ['AccessAgencyContacts'] },
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Portal.Navigation.Reports',
  //       link: `/fleets/my/profile/reports`,
  //     },
  //     {
  //       title: 'Portal.Navigation.WsiPlatform.General.Templates',
  //       link: '/configuration/templates',
  //       permission: { values: ['AccessSettings'] } as Permission,
  //     },
  //     // {
  //     //   title: 'Info',
  //     //   items: [
  //     //     {
  //     //       icon: { name: faInfo },
  //     //       title: 'Api',
  //     //       click: () => window.open('http://130.61.26.101/docs/index.html#', '_blank'),
  //     //     }
  //     //   ]
  //     // }
  //   ] as NavigationOptions[];
  // }


  // public defaultMenu(): NavigationOptions[] {
  //   this.fleetsService.getAll(this.accountService.partnerId, { page: 1, pageSize: MAX_INT }).toPromise();
  //   return [
  //     {
  //       title: 'Portal.Navigation.Dashboard',

  //       link: '/home',
  //       permission: { values: ['AccessAdminPanel'] },
  //     },
  //     {
  //       title: 'Portal.Navigation.Fleets',
  //       // permission: { values: ['AccessAgencyVehicles'] } as Permission,
  //       items: this.fleetResolverService.sidebarItems(null).map(
  //         (x) =>
  //           ({
  //             title: x.label,
  //             permission: x.permission,
  //             icon: { name: x.icon },
  //             link: `/fleets/my/profile/${x.value}`,
  //           } as NavigationOptions)
  //       ),
  //     },
  //     {
  //       title: 'Portal.Navigation.WsiPlatform.General.Bookings',

  //       permission: { values: ['AccessBookings'] },
  //       items: [
  //         {
  //           title: 'Portal.Navigation.WsiPlatform.General.Bookings.ListView',
  //           icon: { name: faThList },
  //           link: '/booking',
  //           permission: { values: ['AccessBookings'] },
  //         },
  //         {
  //           title: 'Portal.Navigation.WsiPlatform.General.Bookings.CreateBooking',
  //           icon: { name: faPlus },
  //           link: '/booking/create',
  //           permission: { values: ['AccessBookings', 'EditBookings', 'CreateBookings'] },
  //         },
  //       ],
  //     },
  //     // {
  //     //   title: 'Customers',
  //     //
  //     //   permission: { values: ['AccessUsers', 'AccessAgencyUsers'] },
  //     //   link: '/users',
  //     //   data: '',
  //     //   items: [
  //     //     {
  //     //       icon: { name: faUserPlus },
  //     //       title: 'Create customer',
  //     //       link: '/users/create',
  //     //       permission: { values: ['CreateUsers', 'EditUsers'] } as Permission,
  //     //     },
  //     //     {
  //     //       icon: { name: faUsers },
  //     //       title: 'Customer list',
  //     //       link: '/users',
  //     //       permission: { values: ['AccessUsers'] } as Permission,
  //     //     },
  //     //   ],
  //     // },
  //     {
  //       title: 'Portal.Navigation.B2C',

  //       permission: { values: ['AccessUsers', 'AccessAgencyUsers'] },
  //       link: '/users/b2c',
  //       data: '',
  //     },
  //     {
  //       title: 'Portal.Navigation.B2B',

  //       permission: { values: ['AccessUsers', 'AccessAgencyUsers'] },
  //       link: '/users/b2b',
  //     },
  //     {
  //       title: 'Portal.Navigation.Contracts',

  //       permission: { values: ['AccessOrders'] },
  //       items: [
  //         {
  //           title: 'Portal.Navigation.Contracts.ListView',
  //           icon: { name: faLayerGroup },
  //           link: '/fleets/my/profile/orders',
  //           permission: { values: ['AccessOrders'] },
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Portal.Navigation.Reports',
  //       link: `/fleets/my/profile/reports`,
  //     },
  //     {
  //       title: 'Portal.Navigation.Invoices',

  //       permission: { values: ['AccessInvoices'] },
  //       items: [
  //         {
  //           title: 'Portal.Navigation.Invoices.ListView',
  //           icon: { name: faLayerGroup },
  //           link: '/fleets/my/profile/invoices',
  //           permission: { values: ['AccessInvoices'] },
  //         },
  //       ],
  //     },
  //     // {
  //     //
  //     //   title: 'Info',
  //     //   items: [
  //     //     {
  //     //       icon: { name: faInfo },
  //     //       title: 'Api',
  //     //       click: () => window.open('http://130.61.26.101/docs/index.html#', '_blank'),
  //     //     }
  //     //   ]
  //     // }
  //   ];
  // }

  private generateMenu(): Observable<NavigationOptions[]> {
   /* switch (this.role) {
      case 'Admin':
        this.myRole = 'Admin';
        return this.generateAdminMenu();
      case 'PartnerAdmin':
        this.myRole = 'PartnerAdmin';*/
        return this.generatePartnerAdminMenu();
      /*case 'FleetManager':
        this.myRole = 'FleetManager';
        return this.generateFleetManagerMenu();
      default:
        return of(this.defaultMenu());
    }*/
  }
}
