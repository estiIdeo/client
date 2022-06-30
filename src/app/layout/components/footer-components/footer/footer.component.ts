import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'prx-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public date: Date = new Date();
  public version: string = environment.version;
  public updatedAt: string = environment.timeStamp;
  constructor() { }

  ngOnInit() { }
}
