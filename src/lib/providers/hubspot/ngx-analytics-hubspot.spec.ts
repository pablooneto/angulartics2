import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsHubspot } from './ngx-analytics-hubspot';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsHubspot', () => {
  let _hsq: Array<any>;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [NgxAnalyticsHubspot],
    });

    window._hsq = _hsq = [];
  });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsHubspot],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsHubspot: NgxAnalyticsHubspot) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(_hsq).toContain([ 'setPath', '/abc' ], [ 'trackPageView' ]);
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsHubspot],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsHubspot: NgxAnalyticsHubspot) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({
          action: 'unused',
          properties: { id: 'Clicked Buy Now button', value: 20.5 },
        });
        advance(fixture);
        expect(_hsq).toContain([
          'trackEvent',
          { id: 'Clicked Buy Now button', value: 20.5 },
        ]);
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsHubspot],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsHubspot: NgxAnalyticsHubspot) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({ email: 'george@jungle.com', id: '1234' });
        advance(fixture);
        expect(_hsq).toContain(['identify', { email: 'george@jungle.com', id: '1234' }]);
      }),
    ),
  );

});
