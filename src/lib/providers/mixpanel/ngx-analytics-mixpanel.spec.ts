import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';

import { NgxAnalytics } from 'ngx-analytics';
import { NgxAnalyticsMixpanel } from './ngx-analytics-mixpanel';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsMixpanel', () => {
  let fixture: ComponentFixture<any>;
  let mixpanel: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [NgxAnalyticsMixpanel],
    });

    window.mixpanel = mixpanel = {
      track: jasmine.createSpy('track'),
      identify: jasmine.createSpy('identify'),
      people: {
        set: jasmine.createSpy('people.set'),
        set_once: jasmine.createSpy('people.set_once'),
      },
      register: jasmine.createSpy('register'),
      register_once: jasmine.createSpy('register_once'),
      alias: jasmine.createSpy('alias'),
    };
  });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsMixpanel],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsMixpanel: NgxAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(mixpanel.track).toHaveBeenCalledWith('Page Viewed', { page: '/abc' });
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsMixpanel],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsMixpanel: NgxAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(mixpanel.track).toHaveBeenCalledWith('do', { category: 'cat' });
      }),
    ),
  );


  it('should set username',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsMixpanel],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsMixpanel: NgxAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUsername.next('testUser');
        advance(fixture);
        expect(mixpanel.identify).toHaveBeenCalledWith('testUser');
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsMixpanel],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsMixpanel: NgxAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(mixpanel.people.set).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties once',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsMixpanel],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsMixpanel: NgxAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserPropertiesOnce.next({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(mixpanel.people.set_once).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set super properties',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsMixpanel],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsMixpanel: NgxAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setSuperProperties.next({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(mixpanel.register).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set super properties once',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsMixpanel],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsMixpanel: NgxAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setSuperPropertiesOnce.next({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(mixpanel.register_once).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set alias',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsMixpanel],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsMixpanel: NgxAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setAlias.next('testAlias');
        advance(fixture);
        expect(mixpanel.alias).toHaveBeenCalledWith('testAlias');
      }),
    ),
  );

});
