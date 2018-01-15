import { Injectable } from '@angular/core';

import { NgxAnalytics } from 'ngx-analytics';

declare var analytics: SegmentAnalytics.AnalyticsJS;

@Injectable()
export class NgxAnalyticsSegment {

  constructor(
    private ngxAnalytics: NgxAnalytics
  ) {
    this.ngxAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.ngxAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.ngxAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
    this.ngxAnalytics.setUserPropertiesOnce.subscribe((x) => this.setUserProperties(x));
    this.ngxAnalytics.setAlias.subscribe((x) => this.setAlias(x));
  }

  /**
   * https://segment.com/docs/libraries/analytics.js/#page
   *
   * analytics.page([category], [name], [properties], [options], [callback]);
   */
  pageTrack(path: string) {
    // TODO : Support optional parameters where the parameter order and type changes their meaning
    try {
      analytics.page(path);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  /**
   * https://segment.com/docs/libraries/analytics.js/#track
   *
   * analytics.track(event, [properties], [options], [callback]);
   */
  eventTrack(action: string, properties: any) {
    try {
      analytics.track(action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  /**
   * https://segment.com/docs/libraries/analytics.js/#identify
   *
   * analytics.identify([userId], [traits], [options], [callback]);
   */
  setUserProperties(properties: any) {
    try {
      if (properties.userId) {
        analytics.identify(properties.userId, properties);
      } else {
        analytics.identify(properties);
      }
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  /**
   * https://segment.com/docs/libraries/analytics.js/#alias
   *
   * analytics.alias(userId, previousId, options, callback);
   */
  setAlias(alias: any) {
    try {
      analytics.alias(alias);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
