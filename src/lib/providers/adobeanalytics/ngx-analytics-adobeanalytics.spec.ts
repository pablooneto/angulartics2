import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsAdobeAnalytics } from './ngx-analytics-adobeanalytics';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

export class MockLocation extends SpyLocation {
  path() {
    return 'http://test.com/test#pagename';
  }
}

describe('NgxAnalyticsAdobeAnalytics', () => {
  let s: any;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        { provide: Location, useClass: MockLocation },
        NgxAnalyticsAdobeAnalytics,
      ],
    });

    window.s = s = jasmine.createSpyObj('s', ['clearVars', 't', 'tl']);
  });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAdobeAnalytics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAdobeAnalytics: NgxAnalyticsAdobeAnalytics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(s.clearVars).toHaveBeenCalled();
        expect(s.t).toHaveBeenCalledWith({ pageName: '/abc' });
      },
    )),
  );

  it('should track events with no delay',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAdobeAnalytics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAdobeAnalytics: NgxAnalyticsAdobeAnalytics) => {
        fixture = createRoot(RootCmp);

        ngxAnalytics.eventTrack.next({ action: 'do', properties: { disableDelay: true } });
        advance(fixture);
        expect(s.tl).toHaveBeenCalledWith(true, 'o', 'do');
        expect(window.s.pageName).toEqual('pagename');
  })));

  it('should track events with custom properties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAdobeAnalytics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAdobeAnalytics: NgxAnalyticsAdobeAnalytics) => {
        fixture = createRoot(RootCmp);

        ngxAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat', prop1: 'user1234' } });
        advance(fixture);
        expect(window.s.prop1).toEqual('user1234');
        expect(window.s.category).toEqual('cat');
        expect(s.tl).toHaveBeenCalledWith(jasmine.any(Object), 'o', 'do');
  })));

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAdobeAnalytics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAdobeAnalytics: NgxAnalyticsAdobeAnalytics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(s.tl).toHaveBeenCalledWith(jasmine.any(Object), 'o', 'do');
        expect(window.s.pageName).toEqual('pagename');
  })));

  it('should set user porperties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAdobeAnalytics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAdobeAnalytics: NgxAnalyticsAdobeAnalytics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({ elet1: 'test' });
        advance(fixture);
        expect(s.elet1).toEqual('test');
        ngxAnalytics.setUserProperties.next({ prop1: 'test' });
        advance(fixture);
        expect(s.prop1).toEqual('test');
      },
    )),
  );
});
