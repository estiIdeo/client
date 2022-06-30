import { NgModule } from '@angular/core';
// Layout specific components
import { MainBodyComponent } from './components/main-body/main-body.component';
import { MenuTogglerComponent } from './components/menu-toggler/menu-toggler.component';
import { HeaderComponent } from './components/header-components/header/header.component';
import { HeaderSearchComponent } from './components/header-components/header-search/header-search.component';
import { HeaderMenuAppsComponent } from './components/header-components/header-menu-apps/header-menu-apps.component';
import { HeaderUserAccountComponent } from './components/header-components/header-user-account/header-user-account.component';
import { QuickSidenavComponent } from './components/quick-sidenav-components/quick-sidenav/quick-sidenav.component';
// import { SidenavComponent } from './components/sidenav-components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer-components/footer/footer.component';
import { QuickSidenavContactsComponent } from './components/quick-sidenav-components/quick-sidenav-contacts/quick-sidenav-contacts.component';
import { QuickSidenavSettingsComponent } from './components/quick-sidenav-components/quick-sidenav-settings/quick-sidenav-settings.component';
import { SidenavItemComponent } from './components/sidenav-components/sidenav-item/sidenav-item.component';
import { SidenavLinkComponent } from './components/sidenav-components/sidenav-link/sidenav-link.component';
import { HeaderToolbarComponent } from './components/header-components/header-toolbar/header-toolbar.component';
import { HeaderNavbarComponent } from './components/header-components/header-navbar/header-navbar.component';
import { HeaderNavbarItemComponent } from './components/header-components/header-navbar-item/header-navbar-item.component';

// Main Layout Components, will be exported to be used in the Shell
import { HorizontalLayoutDefaultComponent } from './horizontal/horizontal-layout-default/horizontal-layout-default.component';
import { IdeoPipesModule } from '@app/@ideo/infrastructure/pipes/pipes.module';
import { NavigationsModule } from '@app/blocks/navigations/navigations.module';
import { SharedModule } from '@app/@shared/shared.module';
import { UtilsModule } from '@app/blocks/utils/utils.module';
import { LoaderModule } from '@app/@ideo/components/loader/loader.module';

const exports = [HorizontalLayoutDefaultComponent];

@NgModule({
  declarations: [
    ...exports,
    HeaderComponent,
    HeaderSearchComponent,
    HeaderMenuAppsComponent,
    HeaderUserAccountComponent,
    QuickSidenavComponent,
    // SidenavComponent,
    MenuTogglerComponent,
    MainBodyComponent,
    FooterComponent,
    QuickSidenavContactsComponent,
    QuickSidenavSettingsComponent,
    SidenavItemComponent,
    SidenavLinkComponent,
    HeaderToolbarComponent,
    HeaderNavbarComponent,
    HeaderNavbarItemComponent,
  ],
  imports: [
    SharedModule,
    UtilsModule,
    NavigationsModule,
    LoaderModule,
    IdeoPipesModule,
  ],
  exports,
})
export class LayoutModule { }
