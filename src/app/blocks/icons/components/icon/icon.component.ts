import { Component, OnInit, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { BaseComponent } from 'src/app/@core/base/base-component';
import { IdeoIconModel } from '../../../../@shared/models/ideo-icon.model';
import { IntelligenceKeys } from '../../../../@shared/types/IntelligenceKeys.type';

@Component({
  selector: 'prx-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent extends BaseComponent implements OnInit {
  @Input() icon: IntelligenceKeys<keyof IdeoIconModel> | IconDefinition

  @Input() size: SizeProp | 'md';

  @Input() iconClass: string;

  @Input() white: boolean = false;


  get useFontAwesome(): boolean {
    return this.isFontAwesome(this.icon as IconDefinition);
  }

  get iconStr(): string {
    return this.icon as string;
  }

  get ideoIcon(): string {
    return IconComponent.ideoIconModel?.[this.iconStr?.toLowerCase()];
  }

  static ideoIconModel = new IdeoIconModel();

  get useIdeo(): boolean {
    return Object.keys(IconComponent.ideoIconModel)?.some((x) => x === this.icon?.toString()?.toLowerCase());
  }

  constructor() {
    super();
  }

  ngOnInit() { }

  isFontAwesome(icon: IconDefinition | string): icon is IconDefinition {
    return !!icon && !!(icon as IconDefinition)?.prefix;
  }
}
