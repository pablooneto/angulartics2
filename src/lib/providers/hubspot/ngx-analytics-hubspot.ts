import { Injectable } from '@angular/core';

import { NgxAnalytics } from 'ngx-analytics';

declare var _hsq: any;

@Injectable()
export class NgxAnalyticsHubspot {

  constructor(
    private ngxAnalytics: NgxAnalytics
  ) {
    if (typeof _hsq === 'undefined') {
      _hsq = [];
    }

    this.ngxAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.ngxAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.ngxAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
  }

  pageTrack(path: string) {
    if (typeof _hsq !== 'undefined') {
      _hsq.push(['setPath', path]);
      _hsq.push(['trackPageView']);
    }
  }

  eventTrack(action: string, properties: any) {
    if (typeof _hsq !== 'undefined') {
      _hsq.push(['trackEvent', properties]);
    }
  }

  setUserProperties(properties: any) {
    if (typeof _hsq !== 'undefined') {
      _hsq.push(['identify', properties]);
    }
  }
}
