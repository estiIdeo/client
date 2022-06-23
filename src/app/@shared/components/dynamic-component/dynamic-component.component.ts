import { Component, OnInit, Input, ComponentFactoryResolver, ViewChild, ComponentRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DynamicComponentModel } from './dynamic.component.model';
import { DynamicComponentDirective } from './dynamic-component.directive';

@Component({
  selector: 'prx-dynamic-component',
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss']
})
export class DynamicComponentComponent<D = any> implements OnInit, OnDestroy {
  @Input() dynamicComponent: DynamicComponentModel<D> = null;
  @ViewChild(DynamicComponentDirective, { static: false }) dynC: DynamicComponentDirective;


  constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) { }
  public componentRef: ComponentRef<any>
  ngOnInit() {
    setTimeout(() => {
      let { dynamicComponent } = this
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicComponent.component);
      const viewContainerRef = this.dynC.viewContainerRef;
      viewContainerRef.clear();
      type componentType = typeof dynamicComponent.componentType;
      this.componentRef = viewContainerRef.createComponent<componentType>(componentFactory);
      this.componentRef.instance.data = dynamicComponent.data;
      this.cd.markForCheck()
    })
  }
  ngOnDestroy() {
    if (!!this?.componentRef?.instance?.['ngOnDestroy']) {
      this.componentRef.instance['ngOnDestroy']();
    }
  }
}
