import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ImageCellModel } from './image-cell.model';
import { ModalsService } from '../../../../../@shared/services/confirm-modal.service';
// import { AcronymModel, AcronymHelperService } from '../../../../../@shared/services/acronym-helper.service';

@Component({
  selector: 'prx-image-cell',
  templateUrl: './image-cell.component.html',
  styleUrls: ['./image-cell.component.scss'],
  providers: [NgbPopoverConfig],
})
export class ImageCellComponent implements OnInit, TableCell {
  public col: TableColumn<any, ImageCellModel>;
  public item: any;
  public isStatic: boolean = false;

  constructor(
    private modalsService: ModalsService,
    // private acronymHelperService: AcronymHelperService,
    config: NgbPopoverConfig) {
    config.placement = ['bottom', 'left', 'auto'];
    config.triggers = 'hover';
    config.animation = true;
    config.openDelay = 300
    config.autoClose = false;
    config.container = 'body';
  }

  public get width() {
    return this.col?.data?.width || 50
  }

  ngOnInit(): void {
    if (!this.col?.data) {
      this.col.data = new ImageCellModel()
    }
  }

  // public _acronymItem: AcronymModel

  getAcronym(item: any = this.item) {
    if (!!this.col?.data?.acronym) {
      return this.col?.data?.acronym
    }
    // else if (
    //   !!this.col?.data?.useDefaultAcronym
    // ) {
    //   if (!this._acronymItem) {
    //     this._acronymItem = this.acronymHelperService.getAcronym(item)
    //   }
    //   return this._acronymItem
    // }
  }

  public getPlacement(evt?: HTMLElement){
    if(evt != null){
      const boundries = evt.getBoundingClientRect();
      let y = 'bottom';
      let x = 'left'
      if(boundries.y <= 600) {
        y = 'top';
      } 
      if(boundries.x <= 200) {
        x = 'right';
      } 
      return `${x}-${y}`;
    }
  }

  public onClick(value: number) {
    if (
      this.col?.data?.openInFullScreen
    ) {
      this.modalsService.fullScreen(value, this.col?.header)
    }
    if (this.col?.onClick) {
      this.col?.onClick(value, this.item[this.col.field])
    }
  }
}
