import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class SortService {
  constructor() {}

  public sort: EventEmitter<string> = new EventEmitter<string>();
}
