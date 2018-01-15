import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';

import { NgxAnalytics } from 'ngx-analytics';
import { NgxAnalyticsGoogleAnalytics } from './ngx-analytics-ga';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsGoogleAnalytics', () => {
  let ga: any;
  let _gaq: Array<any>;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        NgxAnalyticsGoogleAnalytics
      ]
    });
    window.ga = ga = jasmine.createSpy('ga');
    window._gaq = _gaq = [];
  });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsGoogleAnalytics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsGoogleAnalytics: NgxAnalyticsGoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'pageview', '/abc');
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsGoogleAnalytics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsGoogleAnalytics: NgxAnalyticsGoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.settings.ga.additionalAccountNames.push('additionalAccountName');
        ngxAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'event', {
          eventCategory: 'cat',
          eventAction: 'do',
          eventLabel: undefined,
          eventValue: undefined,
          nonInteraction: undefined,
          page: '/',
          userId: null,
          hitCallback: undefined,
        });
        expect(ga).toHaveBeenCalledWith(
          'additionalAccountName.send',
          'event',
          {
            eventCategory: 'cat',
            eventAction: 'do',
            eventLabel: undefined,
            eventValue: undefined,
            nonInteraction: undefined,
            page: '/',
            userId: null,
            hitCallback: undefined,
          },
        );
      },
    )),
  );

  it('should track events with hitCallback',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsGoogleAnalytics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsGoogleAnalytics: NgxAnalyticsGoogleAnalytics) => {
        ngxAnalytics.settings.ga.additionalAccountNames.push('additionalAccountName');

        fixture = createRoot(RootCmp);
        const callback = function() { };
        ngxAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat', hitCallback: callback } });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'event', {
          eventCategory: 'cat',
          eventAction: 'do',
          eventLabel: undefined,
          eventValue: undefined,
          nonInteraction: undefined,
          page: '/',
          userId: null,
          hitCallback: callback,
        });
        expect(ga).toHaveBeenCalledWith(
          'additionalAccountName.send',
          'event',
          {
            eventCategory: 'cat',
            eventAction: 'do',
            eventLabel: undefined,
            eventValue: undefined,
            nonInteraction: undefined,
            page: '/',
            userId: null,
            hitCallback: callback,
          },
        );
      }
    ))
  );

  it('should track exceptions',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsGoogleAnalytics],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsGoogleAnalytics: NgxAnalyticsGoogleAnalytics) => {
          ngxAnalytics.settings.ga.additionalAccountNames.push('additionalAccountName');

          fixture = createRoot(RootCmp);
          ngxAnalytics.exceptionTrack.next({ fatal: true, description: 'test' });
          advance(fixture);
          expect(ga).toHaveBeenCalledWith('send', 'exception', { exFatal: true, exDescription: 'test' });
          expect(ga).toHaveBeenCalledWith('additionalAccountName.send', 'exception', { exFatal: true, exDescription: 'test' });
      })));

  it('should set username',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsGoogleAnalytics],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsGoogleAnalytics: NgxAnalyticsGoogleAnalytics) => {
          fixture = createRoot(RootCmp);
          ngxAnalytics.setUsername.next('testuser');
          advance(fixture);
          expect(ngxAnalytics.settings.ga.userId).toBe('testuser');
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsGoogleAnalytics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsGoogleAnalytics: NgxAnalyticsGoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({ dimension1: 'test' });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('set', 'dimension1', 'test');
        ngxAnalytics.setUserProperties.next({ metric1: 'test' });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('set', 'metric1', 'test');
      }),
    ),
  );

    it('should set user properties on all account names',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsGoogleAnalytics],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsGoogleAnalytics: NgxAnalyticsGoogleAnalytics) => {
          fixture = createRoot(RootCmp);
          ngxAnalytics.settings.ga.additionalAccountNames.push('additionalAccountName');
          ngxAnalytics.settings.ga.additionalAccountNames.push('additionalAccountNameTwo');
          ngxAnalytics.setUserProperties.next({ dimension1: 'test' });
          advance(fixture);
          expect(ga).toHaveBeenCalledWith('set', 'dimension1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountName.set', 'dimension1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountNameTwo.set', 'dimension1', 'test');
          ngxAnalytics.setUserProperties.next({ metric1: 'test' });
          advance(fixture);
          expect(ga).toHaveBeenCalledWith('set', 'metric1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountName.set', 'metric1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountNameTwo.set', 'metric1', 'test');
        }),
      ),
    );

  it('should track user timings',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsGoogleAnalytics],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsGoogleAnalytics: NgxAnalyticsGoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.settings.ga.additionalAccountNames.push('additionalAccountName');
        ngxAnalytics.userTimings.next({ timingCategory: 'cat', timingVar: 'var', timingValue: 100 });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'timing', { timingCategory: 'cat', timingVar: 'var', timingValue: 100 });
        expect(ga).toHaveBeenCalledWith(
          'additionalAccountName.send',
          'timing',
          {
            timingCategory: 'cat',
            timingVar: 'var',
            timingValue: 100,
          },
        );
      },
    )),
  );

});
