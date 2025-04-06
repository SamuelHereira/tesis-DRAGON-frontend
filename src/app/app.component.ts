import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
(window as any).global = window;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tesis_front_end';
  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang('local-es');
    const browserLang = `local-${this.translateService.getBrowserLang()}`;
    const langToUse = browserLang ? browserLang.match(/local-en|local-es/) ? browserLang : 'local-es' : 'local-es';
    this.translateService.use(langToUse);
  }

}
