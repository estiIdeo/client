import { Component, OnInit, HostBinding } from '@angular/core';
import { Layouts } from '@app/@core/models/layout.model';
import { LayoutService } from '@app/@core/services/layout.service';

@Component({
  selector: 'prx-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.scss'],
  host: { class: 'main-body' },
})
export class MainBodyComponent implements OnInit {
  @HostBinding('class.horizontal-default')
  get isHDefault(): boolean {
    return this._layout.layoutToUse === Layouts.HorizontalDefault;
  }

  @HostBinding('class.vertical-default')
  get isVDefault(): boolean {
    return this._layout.layoutToUse === Layouts.VerticalDefault;
  }

  constructor(private _layout: LayoutService) {}

  ngOnInit() {}
}
