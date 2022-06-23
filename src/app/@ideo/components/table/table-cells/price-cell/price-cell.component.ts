import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TableCell } from '../../models/table-cell';
import { TableColumn } from '../../models/table-column';
import { VatService } from '../../../../../@shared/services/vat.service';
import { PriceCellData } from './price-cell-data';

@Component({
  selector: 'prx-price-cell',
  templateUrl: './price-cell.component.html',
  styleUrls: ['./price-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceCellComponent<T = any> implements OnInit, TableCell {
  public col: TableColumn<T, PriceCellData>;
  public item: T;
  public vat: number

  public freeVat: boolean
  public get data(): PriceCellData {
    return this?.col?.data
  }

  constructor(private vatService: VatService, private cd: ChangeDetectorRef) {
    this.vatService.getVatIncludes?.toPromise().then(vat => {
      this.vat = vat
      this.cd?.markForCheck()
    })
  }

  ngOnInit(): void {

    if (!!this.data?.freeVat(this.item)) {
      this.freeVat = true
    }
  }
}
