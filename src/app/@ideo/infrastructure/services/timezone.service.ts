import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Timezone } from '../../core/models/timezone';
import { HttpClient } from '@angular/common/http';
import { SelectItem } from '../../../@forms/@core/interfaces';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimezoneService {
  private timezoneStorageKey = 'timezone';
  private timeZoneListSubject: ReplaySubject<Timezone[]> = new ReplaySubject<Timezone[]>(1);
  private readonly default: Timezone = {
    id: 'UTC',
    displayName: '(UTC) Coordinated Universal Time',
    name: '(UTC) Coordinated Universal Time',
    hoursOffset: 0,
    minutesOffset: 0,
    offsetString: '-0000',
  };

  private _timezone: Timezone;
  private _timezoneList: Timezone[];
  public get timezone(): Timezone {
    if (!this._timezone) {
      let savedTimezone = localStorage.getItem(this.timezoneStorageKey);
      this._timezone = savedTimezone ? JSON.parse(savedTimezone) : this.default;
    }
    return this._timezone;
  }
  public set timezone(val: Timezone) {
    this._timezone = val;
    localStorage.setItem(this.timezoneStorageKey, JSON.stringify(val));
  }

  public get offsetString(): string {
    return this.timezone?.offsetString || '-0000';
  }

  constructor(private http: HttpClient) { }

  private loadTimeZoneList() {
    // return null;
    // this.http.get<Timezone[]>(`Warehouses/TimeZones`)
    //   .pipe(tap(list => this._timezoneList = list))
    //   .subscribe(list => this.timeZoneListSubject.next(list))
  }

  public getTimeZoneList(dataKey?: keyof Timezone): Observable<SelectItem[]> {
    if (!this._timezoneList) {
      this.loadTimeZoneList();
    }
    return this.timeZoneListSubject.pipe(
      map((list) =>
        list.map((timezone) => {
          return {
            label: timezone.name,
            value: dataKey ? timezone[dataKey] : timezone,
          };
        })
      ),
      take(1)
    );
  }

  public fromUtcToDateTime = (d: string | Date) => {
    d = new Date(d)
    d.setMinutes(d.getMinutes() - (d.getTimezoneOffset()));
    return d.toISOString()
  }

  public fromDateTimeToUtc = (d: string | Date) => {
    d = new Date(d)
    return d.toISOString()
  }
}
