// import { Injectable } from '@angular/core';
// import { AccountService } from '../../../@shared/services/account.service';
// import { Permission } from '../permissions/permission';
// import { RolesType } from '../../../@shared/types/role.type';

// @Injectable({
//   providedIn: 'root',
// })
// export class PermissionsService {
//   public get permissions(): any {
//     return this.account.permissions;
//   }

//   constructor(private account: AccountService) {
//     // this.account.listenToLoginState().subscribe((loggedIn) => {
//     // });
//   }

//   public permitted(permission: Permission): boolean {
//     if (!permission) {
//       return true;
//     }

//     const checkArr: boolean[] = []


//     if (!!permission.roles) {
//       /* console all roles => for role type  **/
//       /* set RolesType  **/

//       // const roles: string[] = []
//       // const test = JSON.parse(localStorage.getItem("permissions"))
//       // Object.keys(test)?.forEach(i => roles?.push(...test?.[i] || []))
//       // console.log(
//       //   roles?.removeDuplicate()  // ?.map((i: string) => i?.replace(' ', ''))
//       // )

//       const hasRole = this.account.roles.some((r) => permission.roles.includes(r));
//       checkArr.push(hasRole)
//     }

//     if (!!permission.action) {
//       checkArr.push(
//         !!this.permissions[permission.action.controller] &&
//         this.permissions[permission.action.controller].includes(permission.action.name)
//       );
//     }

//     if (!!permission.values) {
//       const permissions = this.permissions;
//       /* set PermissionType  **/
//       // console.log(JSON.stringify(Object.keys(permissions || {})))
//       const permissionRoles = Object.keys(permissions || {})
//         .filter((x) => permission.values?.includes(x))
//         .map((x) => permissions[x]);
//       checkArr.push(permissionRoles.some((pr) => this.account.roles.some((r) => pr.includes(r))))
//     }



//     if (!!checkArr?.length) {
//       return checkArr?.every(i => !!i)
//     }
//     return false;
//   }
// }
