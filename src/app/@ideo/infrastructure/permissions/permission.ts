import { AnyString } from "@app/@shared/types/any-type.type";
import { PermissionType, RolesType } from "@app/@shared/types/role.type";

export interface Permission {
  roles?: (RolesType | AnyString)[];
  action?: ActionPermission;
  values?: (PermissionType | AnyString)[];
}

export interface ActionPermission {
  controller: string;
  name: string;
}
