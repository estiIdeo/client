import { PermissionType, RolesType } from '../../../@shared/types/role.type';
import { AnyString } from '../../../@shared/types/any-type.type';
export interface Permission {
  roles?: (RolesType | AnyString)[];
  action?: ActionPermission;
  values?: (PermissionType | AnyString)[];
}

export interface ActionPermission {
  controller: string;
  name: string;
}
