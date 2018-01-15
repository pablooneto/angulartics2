import { Injectable } from '@angular/core';

import { NgxAnalytics } from 'ngx-analytics';

declare var _kmq: any;

@Injectable()
export class NgxAnalyticsKissmetrics {

  constructor(
    private ngxAnalytics: NgxAnalytics
  ) {
    if (typeof (_kmq) === 'undefined') {
      _kmq = [];
    }

    this.ngxAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.ngxAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.ngxAnalytics.setUsername.subscribe((x: string) => this.setUsername(x));
    this.ngxAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
  }

  pageTrack(path: string) {
    _kmq.push(['record', 'Pageview', { 'Page': path }]);
  }

  eventTrack(action: string, properties: any) {
    _kmq.push(['record', action, properties]);
  }

  setUsername(userId: string) {
    _kmq.push(['identify', userId]);
  }

  setUserProperties(properties: any) {
    _kmq.push(['set', properties]);
  }
}
