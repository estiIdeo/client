import { Pipe, PipeTransform } from '@angular/core';
import { IdeoIconModel } from '../../../@shared/models/ideo-icon.model';
import { IntelligenceKeys } from '../../../@shared/types/IntelligenceKeys.type';

@Pipe({
  name: 'icon',
})
export class IconPipe implements PipeTransform {
  transform(iconName: IntelligenceKeys<keyof IdeoIconModel>, extension: string = 'svg'): string {
    return `assets/icons/${iconName}.${extension}`;
  }
}
