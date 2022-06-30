import { Component, OnInit } from '@angular/core';
import { BaseLayout } from '../../base/base-layout';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'prx-horizontal-layout-default',
  templateUrl: './horizontal-layout-default.component.html',
  styleUrls: ['./horizontal-layout-default.component.scss'],
})
export class HorizontalLayoutDefaultComponent extends BaseLayout implements OnInit {
  isSidenavCollapsed: boolean;

  constructor(private i18nService: I18nService) {
    super();
  }

  public get isMobile(): boolean {
    return window?.innerWidth < 755
  }

  public get isRtl(): boolean {
    return this.i18nService?.isRtlValue
  }

  ngOnInit() { }

  onSidenavToggled(collapsed: boolean) {
    this.isSidenavCollapsed = collapsed;
  }
}
