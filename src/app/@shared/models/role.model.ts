export interface RoleModel {
  id?: number;
  parentRoleId?: number;
  name: string;
  systemName: string;
  isSystem: boolean;
}
