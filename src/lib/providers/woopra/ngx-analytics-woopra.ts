import { Injectable } from '@angular/core';

import { NgxAnalytics } from 'ngx-analytics';


declare var woopra: any;

@Injectable()
export class NgxAnalyticsWoopra {

  constructor(private ngxAnalytics: NgxAnalytics) {
    if (typeof (woopra) === 'undefined') {
      console.warn('Woopra not found');
    }

    this.ngxAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.ngxAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.ngxAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
  }

  pageTrack(path: string) {
    try {
      woopra.track('pv', {
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
      woopra.track(action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserProperties(properties: any) {
    try {
      if (properties.email) {
        woopra.identify(properties);
      }
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
