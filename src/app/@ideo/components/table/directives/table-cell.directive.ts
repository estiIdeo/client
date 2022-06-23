import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { TableCell } from '../models/table-cell';
import { TableColumn, TableColumnType } from '../models/table-column';
import { TableCellDic } from '../models/types';

@Directive({
  selector: '[tableCell]',
})
export class TableCellDirective implements OnInit {
  public component: ComponentRef<TableCell>;

  @Input('tableCell') public col: TableColumn;
  @Input() public item: any;
  @Input() public isStatic: boolean = false;
  @Input() public isTranslate: boolean = false;

  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}

  ngOnInit(): void {
    let cellType: TableColumnType =
      !!this.col.type || this.col.type === 0 || this.col.type === TableColumnType.StaticImage
        ? this.col.type
        : TableColumnType.Default;
    const factory = this.resolver.resolveComponentFactory<TableCell>(TableCellDic[cellType]);
    this.component = this.container.createComponent(factory);
    this.component.instance.col = this.col;
    this.component.instance.item = this.item;
    this.component.instance.isStatic = this.isStatic || cellType == TableColumnType.StaticImage;
    this.component.instance.isTranslate = this.isTranslate || cellType == TableColumnType.Translate;
  }
}
