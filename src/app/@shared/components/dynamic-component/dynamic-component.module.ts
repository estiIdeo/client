import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicComponentComponent } from './dynamic-component.component';
import { DynamicComponentDirective } from './dynamic-component.directive';

const exports = [
    DynamicComponentComponent,
    DynamicComponentDirective,
];

@NgModule({
    declarations: [...exports],
    imports: [CommonModule],
    exports: exports,
})
export class DynamicComponentModule { }
