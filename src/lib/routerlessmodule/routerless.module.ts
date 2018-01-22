import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

import {
  NgxAnalytics,
  NgxAnalyticsOnModule,
  NgxAnalyticsSettings,
  ANGULARTICS2_TOKEN,
  RouterlessTracking,
} from 'ngx-analytics';

@NgModule({
  imports: [NgxAnalyticsOnModule],
})
export class NgxAnalyticsRouterlessModule {
  static forRoot(
    providers: Provider[],
    settings: Partial<NgxAnalyticsSettings> = {},
  ): ModuleWithProviders {
    return {
      ngModule: NgxAnalyticsRouterlessModule,
      providers: [
        { provide: ANGULARTICS2_TOKEN, useValue: { providers, settings } },
        RouterlessTracking,
        NgxAnalytics,
        ...providers,
      ],
    };
  }
}
