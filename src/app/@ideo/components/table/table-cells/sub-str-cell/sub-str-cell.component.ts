import { Component, OnInit } from '@angular/core';
import { SubStrPipe } from '@app/@ideo/infrastructure/pipes/sub-str.pipe';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';

@Component({
  selector: 'prx-sub-str-cell',
  templateUrl: './sub-str-cell.component.html',
  styleUrls: ['./sub-str-cell.component.scss'],
  providers: [SubStrPipe],
})
export class SubStrCellComponent implements TableCell {
  public col: TableColumn<any>;
  public item: any;
}
