import { Injectable } from '@angular/core';

import { NgxAnalytics } from 'ngx-analytics';

declare var amplitude: {
  getInstance: () => {
    logEvent(action: string, properties: any);
    setUserId(userId: string);
    setUserProperties(properties: any);
  }
};

@Injectable()
export class NgxAnalyticsAmplitude {

  constructor(private ngxAnalytics: NgxAnalytics) {
    this.ngxAnalytics.pageTrack.subscribe((x: any) => this.pageTrack(x.path));

    this.ngxAnalytics.eventTrack.subscribe((x: any) => this.eventTrack(x.action, x.properties));

    this.ngxAnalytics.setUsername.subscribe((x: any) => this.setUsername(x));

    this.ngxAnalytics.setUserProperties.subscribe((x: any) => this.setUserProperties(x));

    this.ngxAnalytics.setUserPropertiesOnce.subscribe((x: any) => this.setUserProperties(x));
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
      amplitude.getInstance().logEvent(action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUsername(userId: string) {
    try {
      amplitude.getInstance().setUserId(userId);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserProperties(properties: any) {
    try {
      amplitude.getInstance().setUserProperties(properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
