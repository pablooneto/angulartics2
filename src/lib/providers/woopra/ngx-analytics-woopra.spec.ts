import {
  fakeAsync,
  inject,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsWoopra } from './ngx-analytics-woopra';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsWoopra', () => {
  let fixture: ComponentFixture<any>;
  let woopra: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [NgxAnalyticsWoopra],
    });

    window.woopra = woopra = {
      track: jasmine.createSpy('track'),
      identify: jasmine.createSpy('identify'),
    };
  });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsWoopra],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsWoopra: NgxAnalyticsWoopra) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.pageTrack.next({path: '/abc' });
        advance(fixture);
        expect(woopra.track).toHaveBeenCalledWith('pv', {url: '/abc'});
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsWoopra],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsWoopra: NgxAnalyticsWoopra) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({
          action: 'payment',
          properties: {
            amount: '49.95',
            currency: 'USD',
          },
        });
        advance(fixture);
        expect(woopra.track).toHaveBeenCalledWith('payment', {
          amount: '49.95',
          currency: 'USD',
        });
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsWoopra],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsWoopra: NgxAnalyticsWoopra) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({email: 'test@test.com', name: 'John Doe', company: 'Test Co'});
        advance(fixture);
        expect(woopra.identify).toHaveBeenCalledWith({
          email: 'test@test.com',
          name: 'John Doe',
          company: 'Test Co'
        });
      }),
    ),
  );
});
