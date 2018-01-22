# ngx-analytics

[![NPM version](https://img.shields.io/npm/v/ngx-analytics.svg)](https://npmjs.org/package/ngx-analytics) [![NPM downloads](https://img.shields.io/npm/dm/ngx-analytics.svg)](https://npmjs.org/package/ngx-analytics)
[![devDependency Status](https://david-dm.org/angulartics/ngx-analytics/dev-status.svg)](https://david-dm.org/angulartics/ngx-analytics#info=devDependencies)
[![Build Status](https://api.travis-ci.org/angulartics/ngx-analytics.svg?branch=master)](https://travis-ci.org/angulartics/ngx-analytics)

[![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Gitter Chat](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/angulartics/ngx-analytics)

Vendor-agnostic Analytics for Angular Applications. [angulartics.github.io/ngx-analytics](https://angulartics.github.io/ngx-analytics "Angulartics Docs")

- [ngx-analytics](#ngx-analytics)
  - [Installation](#installation)
    - [Include it in your application](#include-it-in-your-application)
  - [Usage](#usage)
    - [Tracking events](#tracking-events)
    - [Tracking events in the code](#tracking-events-in-the-code)
    - [Exclude routes from automatic pageview tracking](#exclude-routes-from-automatic-pageview-tracking)
    - [Remove ID's from url paths](#remove-ids-from-url-paths)
    - [Remove Query Params from url paths](#remove-query-params-from-url-paths)
    - [Using Without A Router](#using-without-a-router)
    - [Using With UI-Router](#using-with-ui-router)
  - [Supported providers](#supported-providers)
    - [For other providers](#for-other-providers)
    - [Minimal setup for Google Analytics](#minimal-setup-for-google-analytics)
  - [v4 Migration and Breaking Changes](#v4-migration-and-breaking-changes)
  - [SystemJS](#systemjs)
  - [Contributing](#contributing)
  - [License](#license)


## Installation

```sh
npm install ngx-analytics --save
```

### Include it in your application
1. Add `NgxAnalyticsModule` to your root NgModule passing an array of providers to enable
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { NgxAnalyticsModule } from 'ngx-analytics';
import { NgxAnalyticsGoogleAnalytics } from 'ngx-analytics/ga';

const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),

    // added to imports
    NgxAnalyticsModule.forRoot([NgxAnalyticsGoogleAnalytics]),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
```
2. __Required__: Import your providers in the root component. This starts the tracking of route changes.
```ts
// component
import { NgxAnalyticsGoogleAnalytics } from 'ngx-analytics/ga';

@Component({  ...  })
export class AppComponent {
  constructor(ngx-analyticsGoogleAnalytics: NgxAnalyticsGoogleAnalytics) {}
}
```

## Usage
### Tracking events

To track events you can inject the directive ```ngx-analyticsOn``` into any component and use the attributes ```ngx-analyticsOn```, ```angularticsAction``` and ```angularticsCategory```:


```ts
// component
import { Component } from '@angular/core';

@Component({
  selector: 'song-download-box',
  template: `
    <div 
      ngx-analyticsOn="click"
      angularticsAction="DownloadClick" 
      [angularticsCategory]="song.name">
      Click Me
    </div>`,
})
export class SongDownloadBox {}

import { NgModule } from '@angular/core';
import { NgxAnalyticsModule } from 'ngx-analytics';

@NgModule({
  imports: [
    NgxAnalyticsModule,
  ],
  declarations: [
    SongDownloadBox,
  ]
})
```

If you need event label, you can use
```html
<div 
  ngx-analyticsOn="click"
  angularticsAction="DownloadClick" 
  angularticsLabel="label-name" 
  angularticsValue="value" 
  [angularticsCategory]="song.name" 
  [angularticsProperties]="{'custom-property': 'Fall Campaign'}">
  Click Me
</div>
```


### Tracking events in the code
```ts
import { NgxAnalytics } from 'ngx-analytics';
constructor(private ngx-analytics: NgxAnalytics) {
  this.ngx-analytics.eventTrack.next({
    action: 'myAction', 
    properties: { category: 'myCategory' },
  });
}
```

If you need event label
```ts
this.ngx-analytics.eventTrack.next({
  action: 'myAction',
  properties: { 
    category: 'myCategory', 
    label: 'myLabel',
  },
});
```

### Exclude routes from automatic pageview tracking

Pass string literals or regular expressions to exclude routes from automatic pageview tracking.
````ts
NgxAnalyticsModule.forRoot([providers], {
  pageTracking: {
    excludedRoutes: [
      /\/[0-9]{4}\/[0-9]{2}\/[a-zA-Z0-9|\-]*/,
      '2017/03/article-title'
    ],
  }
}),
````

### Remove ID's from url paths
`/project/12981/feature` becomes `/project/feature`
````ts
NgxAnalyticsModule.forRoot([providers], {
  pageTracking: {
    clearIds: true,
  }
}),
````
By default, it removes IDs matching this pattern (ie. either all numeric or UUID) : `^\d+$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`.

You can set your own regexp if you need to : 

 `/project/a01/feature` becomes `/project/feature`
 ````ts
 NgxAnalyticsModule.forRoot([providers], {
   pageTracking: {
     clearIds: true,
     idsRegExp: /^[a-z]\d+$/,
   }
 }),
 ````

### Remove Query Params from url paths
This can be combined with clearIds and idsRegExp

`/project/12981/feature?param=12` becomes `/project/12981/feature`
````ts
NgxAnalyticsModule.forRoot([providers], {
  pageTracking: {
    clearQueryParams: true,
  }
}),
````

### Using Without A Router
__Warning:__ this support is still experiemental  
`@angular/router` must still be installed! However, it will not be used.
````ts
import { NgxAnalyticsRouterlessModule } from 'ngx-analytics/routerlessmodule';
@NgModule({
  // ...
  imports: [
    BrowserModule,
    NgxAnalyticsRouterlessModule.forRoot([NgxAnalyticsGoogleAnalytics]),
  ],
})
````

### Using With UI-Router
__Warning:__ this support is still experiemental  
`@angular/router` must still be installed! However, it will not be used.  
````ts
import { NgxAnalyticsUirouterModule } from 'ngx-analytics/uiroutermodule';
@NgModule({
  // ...
  imports: [
    BrowserModule,
    NgxAnalyticsUirouterModule.forRoot([NgxAnalyticsGoogleAnalytics]),
  ],
})
````

## Supported providers

* [Google Analytics](/src/lib/providers/ga)
* [Google Tag Manager](/src/lib/providers/gtm)
* [Google Enhanced Ecom](/src/lib/providers/ga-enhanced-ecom)
* [Kissmetrics](/src/lib/providers/kissmetrics)
* [Mixpanel](/src/lib/providers/mixpanel)
* [Piwik](/src/lib/providers/piwik)
* [Segment](/src/lib/providers/segment)
* [Baidu Analytics](/src/lib/providers/baidu)
* [Facebook Pixel](/src/lib/providers/facebook)
* [Application Insights](/src/lib/providers/appinsights)
* [Hubspot](/src/lib/providers/hubspot)
* [Adobe Analytics (Omniture)](/src/lib/providers/adobeanalytics)
* [Intercom](/src/lib/providers/intercom)
* [Woopra](/src/lib/providers/woopra)
* [Clicky](/src/lib/providers/clicky)

### For other providers

If there's no NgxAnalytics plugin for your analytics vendor of choice, please feel free to write yours and PR' it!

### Minimal setup for Google Analytics

To setup Google Analytics add the folowing to main.ts

```ts
import {NgxAnalyticsGoogleAnalytics} from "ngx-analytics/ga";


if (environment.production) {
  // ...
  NgxAnalyticsGoogleAnalytics.prototype.createGaSession(environment.googleAnalytics);
}
```

you can add other environments if you want. In your environment.prod.ts add the configuration

```ts
export const environment = {
  production: true,
  // ...
  googleAnalytics: {
    domain: 'auto',
    trackingId: 'UA-XXXXXXXX-X' // replace with your Tracking Id
  }
};
```

for localhost environments replace 'auto' with 'none'

## v4 Migration and Breaking Changes
See [Release Notes](https://github.com/angulartics/ngx-analytics/releases/tag/v4.0.0)

## SystemJS
Using SystemJS? If you aren't using `defaultJSExtensions: true` you may need to use:
```ts
System.config({
    packages: {
        "/ngx-analytics": {"defaultExtension": "js"},
    },
});
```

## Contributing

Please see the [CONTRIBUTING](https://github.com/angulartics/ngx-analytics/blob/master/.github/CONTRIBUTING.md) and [CODE_OF_CONDUCT](https://github.com/angulartics/ngx-analytics/blob/master/.github/CODE_OF_CONDUCT.md) files for guidelines.

## License

[MIT](LICENSE)
