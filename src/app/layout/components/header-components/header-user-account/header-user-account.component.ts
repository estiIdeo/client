import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/@core/authentication/authentication.service';
import { BaseComponent } from '@app/@core/base/base-component';
import { AuthenticationResponseModel } from '../../../../@shared/models/authentication.response';
import { AccountService } from '../../../../@shared/services/account.service';

@Component({
  selector: 'prx-header-user-account',
  templateUrl: './header-user-account.component.html',
  styleUrls: ['./header-user-account.component.scss'],
})
export class HeaderUserAccountComponent extends BaseComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService, private accountService: AccountService) {
    super();
  }

  @Input() isRtl: boolean
  @Input() isMobile: boolean


  public get authenticationResponse(): AuthenticationResponseModel {
    return this.accountService.user;
  }

  ngOnInit() { }

  logout() {
    // this.authenticationService.logout(true);
  }
}
