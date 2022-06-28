import { Component } from '@angular/core';
import { environment } from '@env/environment';
import { I18nService } from './i18n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'health-client-project';

  constructor(private i18nService: I18nService) {
    this.i18nService.init(
      environment.defaultLanguage,
      environment.supportedLanguages
    );
  }

  ngOnDestroy() {
    this.i18nService.destroy();
  }
}
