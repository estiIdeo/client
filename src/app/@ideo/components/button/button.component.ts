import { Component, Input, OnInit } from '@angular/core';
import { ButtonItem } from '../../core/models/button-item';
import { RtlService } from '../../../@shared/services/rtl.service';

@Component({
  selector: 'ideo-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() button: ButtonItem;
  @Input() item: any;
  @Input() disabled?: boolean;
  public sizeClass: string = '';
  public defaultClass: string = `btn-primary`;

  @Input() public set size(val: 'large' | 'default' | 'small') {
    switch (val) {
      case 'large':
        this.sizeClass = ' btn-lg';
        break;
      case 'small':
        this.sizeClass = ' btn-sm';
        break;
      default:
        break;
    }
  }

  public get isRtl() : boolean {
    return this.rtlService.isRtl;
  }

  constructor(private rtlService: RtlService) {}

  ngOnInit(): void {}
}
