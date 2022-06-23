import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TimezoneService } from '../services/timezone.service';

@Pipe({
  name: 'ideoDate',
})
export class IdeoDatePipe implements PipeTransform {
  private defaultFormat: string = 'M/d/yy HH:mm:ss';
  private incompleteUtc: RegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.?)\d{0,7}$/;

  constructor(private datePipe: DatePipe, private timezoneService: TimezoneService) {}

  transform(date: string, format?: string, ignoreTimeZone: boolean = false): string {
    let response: string;

    if (!date || typeof date != 'string') {
      return date;
    }

    try {
      if (new Date(date).getFullYear() === 1) {
        return '';
      }
      format = format || this.defaultFormat;
      let offset = !ignoreTimeZone ? this.timezoneService.offsetString : '-0000';

      if (!!this.incompleteUtc.test(date)) {
        response = this.datePipe.transform(`${date}Z`, format, offset);
      } else {
        response = this.datePipe.transform(date, format, offset);
      }
    } catch (e) {
      response = date;
    }
    return response;
  }
}
