import {
  ModuleWithProviders,
  NgModule,
  Provider,
} from '@angular/core';

import {
  NgxAnalytics,
  NgxAnalyticsOnModule,
  NgxAnalyticsSettings,
  ANGULARTICS2_TOKEN,
  RouterlessTracking,
} from 'ngx-analytics';
import { UIRouterTracking } from './uirouter';


@NgModule({
  imports: [NgxAnalyticsOnModule],
})
export class NgxAnalyticsUirouterModule {
  static forRoot(
    providers: Provider[],
    settings: Partial<NgxAnalyticsSettings> = {},
  ): ModuleWithProviders {
    return {
      ngModule: NgxAnalyticsUirouterModule,
      providers: [
        { provide: ANGULARTICS2_TOKEN, useValue: { providers, settings } },
        NgxAnalytics,
        { provide: RouterlessTracking, useClass: UIRouterTracking },
        ...providers,
      ],
    };
  }
}
