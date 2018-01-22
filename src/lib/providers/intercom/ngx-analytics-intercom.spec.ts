import {
  fakeAsync,
  inject,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsIntercom } from './ngx-analytics-intercom';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsIntercom', () => {
  let fixture: ComponentFixture<any>;
  let Intercom: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
      providers: [
        NgxAnalyticsIntercom,
      ]
    });

    window.Intercom = Intercom = jasmine.createSpy('Intercom');
  });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsIntercom],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsIntercom: NgxAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('trackEvent', 'Pageview', { url: '/abc' });
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsIntercom],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsIntercom: NgxAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('trackEvent', 'do', { category: 'cat' });
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsIntercom],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsIntercom: NgxAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('boot', {
          userId: '1',
          user_id: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties if no userId present',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsIntercom],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsIntercom: NgxAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({ firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('boot', {
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties once',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsIntercom],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsIntercom: NgxAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserPropertiesOnce.next({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('boot', {
          userId: '1',
          user_id: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties once if no userId present',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsIntercom],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsIntercom: NgxAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserPropertiesOnce.next({
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('boot', {
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );
});
