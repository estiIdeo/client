import { Component, OnInit } from '@angular/core';
import { LayoutModel, Layouts } from '@app/@core/models/layout.model';
import { LayoutService } from '@app/@core/services/layout.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  Layouts = Layouts;
  layout: Layouts;
  layoutConfiguration: LayoutModel;

  get fixedSideNav(): boolean {
    return typeof this.layoutConfiguration.vertical.fixedSideNav === undefined
      ? true
      : this.layoutConfiguration.vertical.fixedSideNav;
  }

  get fixedHeader(): boolean {
    return this.layoutConfiguration.style === 'vertical'
      ? this.layoutConfiguration.vertical.fixedHeader
      : this.layoutConfiguration.horizontal.fixedHeader;
  }

  get sidenavCollapsed(): boolean {
    return this.layoutConfiguration.vertical.sidenavCollapsed || false;
  }

  constructor(private _layout: LayoutService) {
    this.layoutConfiguration = this._layout.layoutConfiguration;
    this.layout = this._layout.layoutToUse;
  }

  ngOnInit() {}
}
