import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RtlService {
  public isRtl: boolean
  public rtlChanged: Subject<boolean> = new Subject<boolean>();
  constructor() { }
}
