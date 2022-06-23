import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imageId',
})
export class ImageIdPipe implements PipeTransform {
  transform(imageId: number, thumbnail: boolean = false): string {
    if (!!imageId) {
      return `${environment.serverUrl}/api/Media/${!!thumbnail ? 'GetThumbnail/' : ''}${imageId}`;
    }
    return ''
  }
}
