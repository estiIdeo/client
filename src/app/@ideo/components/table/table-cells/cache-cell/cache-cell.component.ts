import { Component, OnInit, ChangeDetectorRef, SecurityContext } from '@angular/core';
import { TableCell } from '../../models/table-cell';
import { TableColumn } from '../../models/table-column';
import { CacheCellService } from './cache-cell.service';
import { FormCache } from './form-cache.model';

@Component({
  selector: 'prx-cache-cell',
  templateUrl: './cache-cell.component.html',
  styleUrls: ['./cache-cell.component.scss'],
})
export class CacheCellComponent implements OnInit, TableCell {
  constructor(private cacheCellService: CacheCellService, private cd: ChangeDetectorRef) { }
  col: TableColumn<FormCache>;
  item: any;
  itemCache: any;
  public get saveHtmlType(): SecurityContext {
    return (this.col?.data as FormCache)?.saveHtmlType || 1;
  }

  public hideLoader: boolean = false;

  ngOnInit(): void {
    this.cacheCellService.getFunc = this.col.cacheData$;
    this.cacheCellService.getCache(this.item, this.col, this.col?.bindTo || this.col.field)
      ?.then((res: any) => {
        this.itemCache = res;
      })
      .finally(() => {
        this.hideLoader = true;
        this.cd.markForCheck();
      });

    if (!this.cacheCellService.getFunc || !this.cacheCellService.getCache) {
      this.hideLoader = true;
    }
  }
}
