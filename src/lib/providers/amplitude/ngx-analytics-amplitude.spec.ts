import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsAmplitude } from './ngx-analytics-amplitude';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsAmplitude', () => {
  let fixture: ComponentFixture<any>;
  let amplitudeMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
      providers: [
        NgxAnalyticsAmplitude,
      ]
    });

    amplitudeMock = {
      logEvent: jasmine.createSpy('Amplitude.logEvent'),
      setUserProperties: jasmine.createSpy('Amplitude.setUserProperties'),
      setUserId: jasmine.createSpy('Amplitude.setUserId')
    };

    window.amplitude = {
      getInstance() {
        return amplitudeMock;
      }
    };
  });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAmplitude],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAmplitude: NgxAnalyticsAmplitude) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(amplitudeMock.logEvent).toHaveBeenCalledWith('Pageview', { url: '/abc' });
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAmplitude],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAmplitude: NgxAnalyticsAmplitude) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(amplitudeMock.logEvent).toHaveBeenCalledWith('do', { category: 'cat' });
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAmplitude],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAmplitude: NgxAnalyticsAmplitude) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(amplitudeMock.setUserProperties).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties once',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAmplitude],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAmplitude: NgxAnalyticsAmplitude) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserPropertiesOnce.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(amplitudeMock.setUserProperties).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user name',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsAmplitude],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsAmplitude: NgxAnalyticsAmplitude) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUsername.next('John');
        advance(fixture);
        expect(amplitudeMock.setUserId).toHaveBeenCalledWith('John');
      }),
    ),
  );
});
