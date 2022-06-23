// import { Pipe, PipeTransform } from '@angular/core';
// import { PermissionsService } from '../services/permissions.service';

// @Pipe({
//   name: 'permitted',
// })
// export class PermitPipe implements PipeTransform {
//   constructor(private permissions: PermissionsService) { }

//   transform(arr: any[]): any[] {
//     return arr?.length 
//       ? arr.filter((element) => ( !element.permission || (!!element.permission && !!this.permissions.permitted(element.permission))))
//       : [];
//   }
// }
