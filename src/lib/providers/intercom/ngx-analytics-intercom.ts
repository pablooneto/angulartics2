import { Injectable } from '@angular/core';

import { NgxAnalytics } from 'ngx-analytics';

declare var Intercom: any;

@Injectable()
export class NgxAnalyticsIntercom {

  constructor(
    private ngxAnalytics: NgxAnalytics
  ) {
    this.ngxAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.ngxAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.ngxAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
    this.ngxAnalytics.setUserPropertiesOnce.subscribe((x) => this.setUserProperties(x));
  }

  pageTrack(path: string) {
    try {
      this.eventTrack('Pageview', {
        url: path
      });
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  eventTrack(action: string, properties: any) {
    try {
      Intercom('trackEvent', action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserProperties(properties: any) {
    try {
      if (properties.userId && !properties.user_id) {
        properties.user_id = properties.userId;
      }

      Intercom('boot', properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
