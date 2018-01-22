import {
  ModuleWithProviders,
  NgModule,
  Provider,
} from '@angular/core';

import { AngularRouterTracking } from './angular-router';
import { NgxAnalytics } from './ngx-analytics';
import { NgxAnalyticsSettings } from './ngx-analytics-config';
import { ANGULARTICS2_TOKEN } from './ngx-analytics-token';
import { NgxAnalyticsOn, NgxAnalyticsOnModule } from './ngx-analyticsOn';
import { RouterlessTracking } from './routerless';


@NgModule({
  imports: [NgxAnalyticsOnModule],
  exports: [NgxAnalyticsOn],
})
export class NgxAnalyticsModule {
  static forRoot(
    providers: Provider[],
    settings: Partial<NgxAnalyticsSettings> = {},
  ): ModuleWithProviders {
    return {
      ngModule: NgxAnalyticsModule,
      providers: [
        { provide: ANGULARTICS2_TOKEN, useValue: { providers, settings } },
        NgxAnalytics,
        { provide: RouterlessTracking, useClass: AngularRouterTracking },
        ...providers,
      ],
    };
  }
}
