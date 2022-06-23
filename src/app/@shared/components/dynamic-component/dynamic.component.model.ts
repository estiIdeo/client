import { Type } from '@angular/core';

export type DynamicComponentModel<D = any, T extends DynamicComponentDataModel<D> = any> = {
    componentType: T
    component: Type<T>
    data: D
}

export type DynamicComponentDataModel<D = any> = {
    data: D
}