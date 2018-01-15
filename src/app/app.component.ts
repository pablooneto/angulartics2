import { Component } from '@angular/core';

const importModule = `import { NgxAnalyticsModule } from 'ngx-analytics';
import { NgxAnalyticsGoogleAnalytics } from 'ngx-analytics/ga';

@NgModule({
  imports: [
    // added to imports
    NgxAnalyticsModule.forRoot([NgxAnalyticsGoogleAnalytics]),
  ],
})
`;

const importComponent = `import { NgxAnalyticsGoogleAnalytics } from 'ngx-analytics/ga';

@Component({
  selector: 'app',
  template: \`your template\`
})
export class AppComponent {
  // initializes the service and starts event subscriptions
  constructor(googleAnalytics: NgxAnalyticsGoogleAnalytics) {}
}
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  importModule = importModule;
  importComponent = importComponent;
}
