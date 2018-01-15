import { InjectionToken, Provider } from '@angular/core';

import { NgxAnalyticsSettings } from './ngx-analytics-config';

export interface NgxAnalyticsToken {
  providers: Provider[];
  settings: Partial<NgxAnalyticsSettings>;
}

export const ANGULARTICS2_TOKEN = new InjectionToken<NgxAnalyticsToken>('ANGULARTICS2');
