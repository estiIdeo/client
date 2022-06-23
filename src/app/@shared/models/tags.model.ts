export interface TagsModel {
  id?: number;
  partnerId: number;
  autoTag: AutoTagType;
  key?: string;
  value: string;
  created?: Date;
  updated?: Date;
}

export interface TagCellModel {
  label?: string;
  value: any;
  tooltip: string;
  autoTag?: AutoTagType;
  isValid?: boolean;
  partnerId: number;
  id?: number;
  isValDate?: boolean;
}

export enum AutoTagType {
  None = 0,
}
export interface ItemTagModel {
  autoTag?: AutoTagType;
  tagKey?: string;
  tagValue?: string | number;
  tagId: number;
  created?: Date;
  updated?: Date;
}
export interface UserTagModel extends ItemTagModel {
  userId: number;
}
export interface TagLookupModel {
  autoTag?: AutoTagType;
  tagKey?: string;
  tagValue?: string | number;
  primaryTagId?: number;
  secondaryTagId: number;
  isExcluded?: boolean;
  created?: Date;
}
