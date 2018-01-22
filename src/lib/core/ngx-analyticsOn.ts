import {
  AfterContentInit,
  Directive,
  ElementRef,
  Injectable,
  Input,
  NgModule,
  Renderer2,
} from '@angular/core';
import { NgxAnalytics } from './ngx-analytics';

@Injectable()
@Directive({ selector: '[ngx-analyticsOn]' })
export class NgxAnalyticsOn implements AfterContentInit {
  @Input('ngx-analyticsOn') ngxAnalyticsOn: string;
  @Input() angularticsAction: string;
  @Input() angularticsCategory: string;
  @Input() angularticsLabel: string;
  @Input() angularticsValue: string;
  @Input() angularticsProperties: any = {};

  constructor(
    private elRef: ElementRef,
    private ngxAnalytics: NgxAnalytics,
    private renderer: Renderer2
  ) { }

  ngAfterContentInit() {
    this.renderer.listen(
      this.elRef.nativeElement,
      this.ngxAnalyticsOn || 'click',
      (event: Event) => this.eventTrack(event),
    );
  }

  eventTrack(event: Event) {
    const action = this.angularticsAction; // || this.inferEventName();
    const properties: any = {
      ...this.angularticsProperties,
      eventType: event.type,
    };

    if (this.angularticsCategory) {
      properties.category = this.angularticsCategory;
    }
    if (this.angularticsLabel) {
      properties.label = this.angularticsLabel;
    }
    if (this.angularticsValue) {
      properties.value = this.angularticsValue;
    }

    this.ngxAnalytics.eventTrack.next({
      action,
      properties,
    });
  }

  /*private isCommand() {
    return ['a:', 'button:', 'button:button', 'button:submit', 'input:button', 'input:submit'].indexOf(
      getDOM().tagName(this.el).toLowerCase() + ':' + (getDOM().type(this.el) || '')) >= 0;
  }

  private inferEventName() {
    if (this.isCommand()) return getDOM().getText(this.el) || getDOM().getValue(this.el);
    return getDOM().getProperty(this.el, 'id') || getDOM().getProperty(this.el, 'name') || getDOM().tagName(this.el);
  }*/
}

@NgModule({
  declarations: [NgxAnalyticsOn],
  exports: [NgxAnalyticsOn],
})
export class NgxAnalyticsOnModule {}
