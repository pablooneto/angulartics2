import { Injectable } from '@angular/core';

import { NgxAnalytics } from 'ngx-analytics';

declare var mixpanel: any;

@Injectable()
export class NgxAnalyticsMixpanel {

  constructor(
    private ngxAnalytics: NgxAnalytics
  ) {
    this.ngxAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.ngxAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.ngxAnalytics.setUsername.subscribe((x: string) => this.setUsername(x));
    this.ngxAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
    this.ngxAnalytics.setUserPropertiesOnce.subscribe((x) => this.setUserPropertiesOnce(x));
    this.ngxAnalytics.setSuperProperties.subscribe((x) => this.setSuperProperties(x));
    this.ngxAnalytics.setSuperPropertiesOnce.subscribe((x) => this.setSuperPropertiesOnce(x));
    this.ngxAnalytics.setAlias.subscribe((x) => this.setAlias(x));
  }

  pageTrack(path: string) {
    try {
      mixpanel.track('Page Viewed', { page: path });
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  eventTrack(action: string, properties: any) {
    try {
      mixpanel.track(action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUsername(userId: string) {
    try {
      mixpanel.identify(userId);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserProperties(properties: any) {
    try {
      mixpanel.people.set(properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserPropertiesOnce(properties: any) {
    try {
      mixpanel.people.set_once(properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setSuperProperties(properties: any) {
    try {
      mixpanel.register(properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setSuperPropertiesOnce(properties: any) {
    try {
      mixpanel.register_once(properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setAlias(alias: any) {
    try {
      mixpanel.alias(alias);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
