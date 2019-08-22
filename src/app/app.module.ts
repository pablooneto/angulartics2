// import { HttpClientModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatIconModule } from '@angular/material/icon';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProvidersComponent } from './providers/providers.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProvidersComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // HttpModule,

    NgbCollapseModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
