import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/@core/base/base-component';


@Component({
  selector: 'prx-card-footer',
  templateUrl: './card-footer.component.html',
  styleUrls: ['./card-footer.component.scss'],
})
export class CardFooterComponent extends BaseComponent implements OnInit {
  constructor() {
    super('card-footer');
  }

  ngOnInit(): void {}
}
