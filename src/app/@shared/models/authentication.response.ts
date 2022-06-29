import { RolesType } from '../types/role.type';
export interface AuthenticationResponseModel {
  username: string;
  userId: number;
  avatarId?: number;
  firstName: string;
  lastName: string;
  token: string;
  refreshToken: string;
  validFrom: Date;
  validTo: Date;
  roles: RolesType[];
  partnerId?: number;
  type: string;
  partnerFleetIds?: { [partnerId: number]: number[] };
}
