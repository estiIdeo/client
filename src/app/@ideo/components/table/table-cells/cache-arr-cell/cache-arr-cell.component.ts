import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/@core/base/base-component';
import { SelectItem } from '../../models/select-item';
import { TableCell } from '../../models/table-cell';
import { TableColumn } from '../../models/table-column';
import { FormCache } from '../cache-cell/form-cache.model';

@Component({
  selector: 'prx-cache-arr-cell',
  templateUrl: './cache-arr-cell.component.html',
  styleUrls: ['./cache-arr-cell.component.scss'],
})
export class CacheArrCellComponent extends BaseComponent implements OnInit, TableCell {
  constructor(private cd: ChangeDetectorRef) {
    super();
  }
  col: TableColumn<FormCache>;
  item: any;
  newItem: any;
  itemCaches: SelectItem[];

  ngOnInit(): void {
    let newItem = this.item;
    if (this.col.parsedFullData) {
      newItem = this.col.parsedFullData(newItem);
    }
    if (this.col.parsedData) {
      newItem = this.col.parsedData(newItem !== this.item ? newItem : this.item[this.col.field]);
    }
    if (this.col.parsedData$) {
      newItem = this.col.parsedData$(newItem).then((res) => {
        if (!!res) {
          this.itemCaches = newItem;
        }
      });
    } else {
      this.itemCaches = newItem;
    }
  }

  public href(itemCache: SelectItem): any {
    if (!this.col.href) return
    return this.col.href(itemCache, this.item)
  }

  onClick(itemCache: SelectItem) {
    if (!this.col.onClick) return
    this.col.cacheDataArr$(itemCache as any).toPromise().then(res => {
      if (!!res) {
        this.col.onClick(res, this.item)
      }
    })
  }
}
