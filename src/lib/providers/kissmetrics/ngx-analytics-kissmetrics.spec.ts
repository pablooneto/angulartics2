import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsKissmetrics } from './ngx-analytics-kissmetrics';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsKissmetrics', () => {
  let _kmq: Array<any>;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [NgxAnalyticsKissmetrics],
    });

    window._kmq = _kmq = [];
  });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsKissmetrics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsKissmetrics: NgxAnalyticsKissmetrics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(_kmq).toContain(['record', 'Pageview', { 'Page': '/abc' }]);
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsKissmetrics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsKissmetrics: NgxAnalyticsKissmetrics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(_kmq).toContain(['record', 'do', { category: 'cat' }]);
      }),
    ),
  );

  it('should set username',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsKissmetrics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsKissmetrics: NgxAnalyticsKissmetrics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUsername.next('testUser');
        advance(fixture);
        expect(_kmq).toContain(['identify', 'testUser']);
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsKissmetrics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsKissmetrics: NgxAnalyticsKissmetrics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(_kmq).toContain(['set', { userId: '1', firstName: 'John', lastName: 'Doe' }]);
      }),
    ),
  );

});
