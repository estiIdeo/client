import { Component, OnInit, OnDestroy } from '@angular/core';
import { RtlService } from '../../../@shared/services/rtl.service';

@Component({
  selector: 'prx-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})

export class WelcomeComponent implements OnInit, OnDestroy {

  public get isRtl(): boolean {
    return this.rtlService.isRtl;
  }

  constructor(
    private rtlService: RtlService,
  ) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
  }

}
