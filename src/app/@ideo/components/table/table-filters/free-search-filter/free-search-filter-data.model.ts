import { SelectItem } from '../../models/select-item';
export interface FreeSearchFilterData<T = any> {
    filterKeys: SelectItem<{ [k: string]: keyof T }>[]
}