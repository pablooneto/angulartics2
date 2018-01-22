import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsFacebook } from './ngx-analytics-facebook';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsFacebook', () => {
  let fbq: any;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [NgxAnalyticsFacebook],
    });

    window.fbq = fbq = jasmine.createSpy('fbq');
  });

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsFacebook],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsFacebook: NgxAnalyticsFacebook) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({
          action: 'ViewContent',
          properties: { category: 'cat' },
        });
        advance(fixture);
        expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', { category: 'cat' });
      }),
    ),
  );

  it('should track custom events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsFacebook],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsFacebook: NgxAnalyticsFacebook) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({
          action: 'do',
          properties: { category: 'cat' },
        });
        advance(fixture);
        expect(fbq).toHaveBeenCalledWith('trackCustom', 'do', { category: 'cat' });
      }),
    ),
  );

});
