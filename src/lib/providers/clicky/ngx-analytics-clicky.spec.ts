import {
  fakeAsync,
  inject,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsClicky } from './ngx-analytics-clicky';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsClicky', () => {
  let clicky: any;
  // let clicky_custom: any;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [NgxAnalyticsClicky, Title],
    });
    window.console = jasmine.createSpyObj('console', ['warn', 'log']);
  });

  describe('on init', () => {
    beforeEach(() => {
      window.console = jasmine.createSpyObj('console', ['warn', 'log']);
    });

    it('should complain if clicky is not found',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsClicky],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsClicky: NgxAnalyticsClicky) => {
          window.clicky = undefined;
          fixture = createRoot(RootCmp);
          advance(fixture);
          expect(console.warn).toHaveBeenCalled();
        }),
      ),
    );
  });

  describe('while active', () => {
    beforeEach(() => {
      window.clicky = clicky = jasmine.createSpyObj('clicky', ['log', 'goal']);
    });

    it('should track pages',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsClicky, Title],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsClicky: NgxAnalyticsClicky, titleService: Title) => {
          fixture = createRoot(RootCmp);
          const title = 'clicky';
          titleService.setTitle(title);
          ngxAnalytics.pageTrack.next({ path: '/abc' });
          advance(fixture);
          expect(clicky.log).toHaveBeenCalledWith('/abc', title, 'pageview');
        }),
      ),
    );

    it('should track events',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsClicky],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsClicky: NgxAnalyticsClicky) => {
          fixture = createRoot(RootCmp);
          ngxAnalytics.eventTrack.next({
            action: 'do',
            properties: { title: 'thing', type: 'click' },
          });
          advance(fixture);
          expect(clicky.log).toHaveBeenCalledWith('do', 'thing', 'click');
        }),
      ),
    );

    it('should track unsupported event types as pageviews',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsClicky],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsClicky: NgxAnalyticsClicky) => {
          fixture = createRoot(RootCmp);
          ngxAnalytics.eventTrack.next({
            action: 'do',
            properties: {
              title: 'thing',
              type: 'unsupported-gibberish',
            },
          });
          advance(fixture);
          expect(clicky.log).toHaveBeenCalledWith('do', 'thing', 'pageview');
        }),
      ),
    );

    it('should track goals',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsClicky],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsClicky: NgxAnalyticsClicky) => {
          fixture = createRoot(RootCmp);
          ngxAnalytics.eventTrack.next({
            action: 'do',
            properties: { goal: 1, revenue: 50, noQueue: true },
          });
          advance(fixture);
          expect(clicky.goal).toHaveBeenCalledWith(1, 50, true);
        }),
      ),
    );

  });
});
