import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsAppInsights } from './ngx-analytics-appinsights';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare let window: any;

describe('NgxAnalyticsAppInsights', () => {
  let appInsights: Microsoft.ApplicationInsights.IAppInsights;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
        RouterTestingModule,
      ],
      providers: [
        Title,
        NgxAnalyticsAppInsights,
      ],
    });

    window.appInsights = appInsights = jasmine.createSpyObj(
      'appInsights', [
        'trackPageView',
        'trackEvent',
        'trackException',
        'setAuthenticatedUserContext',
      ]);
    });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAppInsights, Title],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAppInsights: NgxAnalyticsAppInsights, title: Title) => {
        fixture = createRoot(RootCmp);
        const metrics = {};
        const dimensions = {};
        const loadTime = 123;
        spyOn(title, 'getTitle').and.returnValue('the title');
        ngxAnalyticsAppInsights.metrics = metrics;
        ngxAnalyticsAppInsights.dimensions = dimensions;
        ngxAnalyticsAppInsights.loadTime = loadTime;
        ngxAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(appInsights.trackPageView).toHaveBeenCalledWith('the title', '/abc', metrics, dimensions, loadTime);
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAppInsights],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAppInsights: NgxAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const action = 'the action';
        const properties = {};
        const measurements = {};
        ngxAnalyticsAppInsights.measurements = measurements;
        ngxAnalytics.eventTrack.next({
          action, properties
        });
        advance(fixture);
        expect(appInsights.trackEvent).toHaveBeenCalledWith(action, properties, measurements);
      }),
    ),
  );

  it('should track exceptions (string)',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAppInsights],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAppInsights: NgxAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const str = 'test string';
        ngxAnalytics.exceptionTrack.next(str);
        advance(fixture);
        expect(appInsights.trackException).toHaveBeenCalledWith(str);
      }),
    ),
  );

  it('should track exceptions (event)',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAppInsights],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAppInsights: NgxAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const event = { 'event': true };
        ngxAnalytics.exceptionTrack.next({ event });
        advance(fixture);
        expect(appInsights.trackException).toHaveBeenCalledWith(event);
      }),
    ),
  );

  it('should track exceptions (description)',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAppInsights],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAppInsights: NgxAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const description = 'test description';
        ngxAnalytics.exceptionTrack.next({ description });
        advance(fixture);
        expect(appInsights.trackException).toHaveBeenCalledWith(description);
      }),
    ),
  );

  it('should set userId in setAuthenticatedUserContext',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAppInsights],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAppInsights: NgxAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const userId = 'test_userId';
        ngxAnalyticsAppInsights.setUsername(userId);
        advance(fixture);
        expect(ngxAnalytics.settings.appInsights.userId).toBe(userId);
        expect(appInsights.setAuthenticatedUserContext).toHaveBeenCalledWith(userId);
      }),
    ),
  );

  it('should set userId and accountId in setAuthenticatedUserContext',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAppInsights],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAppInsights: NgxAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const userId = 'test_userId';
        const accountId = 'test_accountId';
        ngxAnalyticsAppInsights.setUserProperties({ userId, accountId });
        advance(fixture);
        expect(ngxAnalytics.settings.appInsights.userId).toBe(userId);
        expect(appInsights.setAuthenticatedUserContext).toHaveBeenCalledWith(userId, accountId);
      }),
    ),
  );


  it('should user existing userId and set accountId in setAuthenticatedUserContext',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAppInsights],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAppInsights: NgxAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const userId = 'test_userId';
        const accountId = 'test_accountId';
        ngxAnalyticsAppInsights.setUsername(userId);
        advance(fixture);
        expect(ngxAnalytics.settings.appInsights.userId).toBe(userId);
        ngxAnalyticsAppInsights.setUserProperties({ accountId });
        advance(fixture);
        expect(appInsights.setAuthenticatedUserContext).toHaveBeenCalledWith(userId, accountId);
      }),
    ),
  );

  it('should set the start time on start',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAppInsights],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAppInsights: NgxAnalyticsAppInsights) => {
        ngxAnalyticsAppInsights.startTimer();
        expect(ngxAnalyticsAppInsights.loadStartTime).toBeLessThanOrEqual(Date.now());
        expect(ngxAnalyticsAppInsights.loadTime).toBe(null);
      }),
    ),
  );

  it('should set the total time on stop',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAppInsights],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAppInsights: NgxAnalyticsAppInsights) => {
        ngxAnalyticsAppInsights.loadStartTime = Date.now() - 1000;
        ngxAnalyticsAppInsights.stopTimer();
        // 50ms time difference for testing to ensure timing is correct
        expect(ngxAnalyticsAppInsights.loadTime).toBeLessThanOrEqual(1150);
        expect(ngxAnalyticsAppInsights.loadTime).toBeGreaterThanOrEqual(1000);
        expect(ngxAnalyticsAppInsights.loadStartTime).toBe(null);
      }),
    ),
  );
});
