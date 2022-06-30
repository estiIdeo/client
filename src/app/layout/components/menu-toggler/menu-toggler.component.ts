import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '@app/@core/base/base-component';

@Component({
  selector: 'prx-menu-toggler',
  templateUrl: './menu-toggler.component.html',
  styleUrls: ['./menu-toggler.component.scss'],
})
export class MenuTogglerComponent extends BaseComponent implements OnInit {
  constructor() {
    super('menu-toggler');
  }
  ngOnInit(): void { }
}
