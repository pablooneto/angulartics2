import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAnalytics } from 'ngx-analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { NgxAnalyticsPiwik } from './ngx-analytics-piwik';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('NgxAnalyticsPiwik', () => {
  let _paq: Array<any>;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [NgxAnalyticsPiwik],
    });

    window._paq = _paq = [];
  });

  it('should track pages',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsPiwik],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsPiwik: NgxAnalyticsPiwik) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.pageTrack.next({path: '/abc' });
        advance(fixture);
        expect(_paq).toContain(['setCustomUrl', '/abc']);
      },
    )),
  );

  describe('track a basic event or an ecommerce event', () => {
    let product: any;

    beforeEach(() => {
      product = {
        productSKU: 1,
        productName: 'product name',
        productCategory: 'product category',
        price: 1.23,
        quantity: 1
      };
    });

    it('should track set ecommerce view events',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsPiwik],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsPiwik: NgxAnalyticsPiwik) => {
          fixture = createRoot(RootCmp);

          // Set up ecommerce view description to inform Piwik that product details are shown
          const ecommerceViewDescription = product;
          ecommerceViewDescription.categoryName = 'category name';

          ngxAnalytics.eventTrack.next({action: 'setEcommerceView', properties: ecommerceViewDescription});
          advance(fixture);

          expect(_paq).toContain(['setEcommerceView',
            ecommerceViewDescription.productSKU,
            ecommerceViewDescription.productName,
            ecommerceViewDescription.categoryName,
            ecommerceViewDescription.price
          ]);
        },
      )),
    );


    it('should track goals',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsPiwik],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsPiwik: NgxAnalyticsPiwik) => {
          fixture = createRoot(RootCmp);

          const piwikGoal = {
            goalId: 1,
            value: 35,
          };

          ngxAnalytics.eventTrack.next({action: 'trackGoal', properties: piwikGoal});
          advance(fixture);

          expect(_paq).toContain([
            'trackGoal',
            piwikGoal.goalId,
            piwikGoal.value,
          ]);
        }
      )),
    );

    it('should track add ecommerce item events',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsPiwik],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsPiwik: NgxAnalyticsPiwik) => {
          fixture = createRoot(RootCmp);

          ngxAnalytics.eventTrack.next({action: 'addEcommerceItem', properties: product});
          advance(fixture);

          expect(_paq).toContain(['addEcommerceItem',
            product.productSKU,
            product.productName,
            product.productCategory,
            product.price,
            product.quantity
          ]);
        }
      )),
    );

    it('should track ecommerce cart update events',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsPiwik],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsPiwik: NgxAnalyticsPiwik) => {
          fixture = createRoot(RootCmp);

          ngxAnalytics.eventTrack.next({action: 'trackEcommerceCartUpdate', properties: {grandTotal: 15.5}});
          advance(fixture);

          expect(_paq).toContain(['trackEcommerceCartUpdate', 15.5]);
        }
      )),
    );

    it('should track ecommerce order events',
      fakeAsync(inject([NgxAnalytics, NgxAnalyticsPiwik],
        (ngxAnalytics: NgxAnalytics, ngxAnalyticsPiwik: NgxAnalyticsPiwik) => {
          fixture = createRoot(RootCmp);

          const ecommerceOrder = {
            orderId: 'A10000123',
            grandTotal: 35,
            subTotal: 30,
            tax: 5.5,
            shipping: 4.5,
            discount: false,
          };

          ngxAnalytics.eventTrack.next({action: 'trackEcommerceOrder', properties: ecommerceOrder});
          advance(fixture);

          expect(_paq).toContain(['trackEcommerceOrder',
            ecommerceOrder.orderId,
            ecommerceOrder.grandTotal,
            ecommerceOrder.subTotal,
            ecommerceOrder.tax,
            ecommerceOrder.shipping,
            ecommerceOrder.discount
          ]);
        }
      )),
    );

    it('should track events', fakeAsync(inject([NgxAnalytics, NgxAnalyticsPiwik],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsPiwik: NgxAnalyticsPiwik) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.eventTrack.next({action: 'do', properties: {category: 'cat'}});
        advance(fixture);
        expect(_paq).toContain(['trackEvent', 'cat', 'do', undefined, undefined]);
      }
    )));

  });

  it('should set username', fakeAsync(inject([NgxAnalytics, NgxAnalyticsPiwik],
    (ngxAnalytics: NgxAnalytics, ngxAnalyticsPiwik: NgxAnalyticsPiwik) => {
      fixture = createRoot(RootCmp);
      ngxAnalytics.setUsername.next('testUser');
      advance(fixture);
      expect(_paq).toContain(['setUserId', 'testUser']);
    }
  )));

  it('should set user properties as custom variable',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsPiwik],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsPiwik: NgxAnalyticsPiwik) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({userId: '1', firstName: 'John', lastName: 'Doe'});
        advance(fixture);
        expect(_paq).toContain([
          'setCustomVariable',
          { userId: '1', firstName: 'John', lastName: 'Doe' },
        ]);
      }
    )),
  );

  it('should set user properties as custom dimension',
    fakeAsync(inject([NgxAnalytics, NgxAnalyticsPiwik],
      (ngxAnalytics: NgxAnalytics, ngxAnalyticsPiwik: NgxAnalyticsPiwik) => {
        fixture = createRoot(RootCmp);
        ngxAnalytics.setUserProperties.next({
          dimension1: 'v1.2.3',
          dimension2: 'german',
          dimension43: 'green',
        });
        advance(fixture);
        expect(_paq).toContain(['setCustomDimension', 1, 'v1.2.3']);
        expect(_paq).toContain(['setCustomDimension', 2, 'german']);
        expect(_paq).toContain(['setCustomDimension', 43, 'green']);
      },
    )),
  );

});
