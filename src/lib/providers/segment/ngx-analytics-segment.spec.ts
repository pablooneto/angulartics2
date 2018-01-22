import {
  fakeAsync,
  inject,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsSegment } from './ngx-analytics-segment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsSegment', () => {

  let fixture: ComponentFixture<any>;
  let analytics: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [NgxAnalyticsSegment],
    });

    window.analytics = analytics = {
      page: jasmine.createSpy('page'),
      track: jasmine.createSpy('track'),
      identify: jasmine.createSpy('identify'),
      alias: jasmine.createSpy('alias')
    };
  });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsSegment],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsSegment: NgxAnalyticsSegment) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(analytics.page).toHaveBeenCalledWith('/abc');
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsSegment],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsSegment: NgxAnalyticsSegment) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(analytics.track).toHaveBeenCalledWith('do', {
          category: 'cat',
        });
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsSegment],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsSegment: NgxAnalyticsSegment) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(analytics.identify).toHaveBeenCalledWith('1', {
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties once',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsSegment],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsSegment: NgxAnalyticsSegment) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserPropertiesOnce.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(analytics.identify).toHaveBeenCalledWith('1', {
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set alias',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsSegment],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsSegment: NgxAnalyticsSegment) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setAlias.next('testAlias');
        advance(fixture);
        expect(analytics.alias).toHaveBeenCalledWith('testAlias');
      }),
    ),
  );

});
