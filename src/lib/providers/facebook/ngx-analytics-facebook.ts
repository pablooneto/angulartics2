import { Injectable } from '@angular/core';

import { NgxAnalytics } from 'ngx-analytics';

declare const fbq: facebook.Pixel.Event;

const facebookEventList = [
  'ViewContent',
  'Search',
  'AddToCart',
  'AddToWishlist',
  'InitiateCheckout',
  'AddPaymentInfo',
  'Purchase',
  'Lead',
  'CompleteRegistration',
];

@Injectable()
export class NgxAnalyticsFacebook {
  constructor(private ngxAnalytics: NgxAnalytics) {
    this.ngxAnalytics.eventTrack.subscribe(x => this.eventTrack(x.action, x.properties));
  }

  /**
   * Send interactions to the Pixel, i.e. for event tracking in Pixel
   *
   * @param action action associated with the event
   */
  eventTrack(action: string, properties: any = {}) {
    if (typeof fbq === 'undefined') {
      return;
    }
    if (facebookEventList.indexOf(action) === -1) {
      return fbq('trackCustom', action, properties);
    }
    return fbq('track', action, properties);
  }
}
