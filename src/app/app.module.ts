import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './pages/start/start.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth.interceptor';
import { CollectComponent } from './pages/collect/collect.component';

import { PolicyViewComponent } from './components/policy-view/policy-view.component';
import { StatComponent } from './components/stat/stat.component';


import { ChartsModule } from 'ng2-charts';
import { RealtimeChartComponent } from './components/realtime-chart/realtime-chart.component';
import { InlineComponent } from './pages/inline/inline.component';
import { DirectivePipe } from './pipes/directive.pipe';
import { DebugComponent } from './pages/debug/debug.component';
import { HomeComponent } from './pages/home/home.component';
import { WizardComponent } from './pages/wizard/wizard.component';
import { DeployComponent } from './pages/deploy/deploy.component';
import { ManualComponent } from './pages/manual/manual.component';

import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';


@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    CollectComponent,

    PolicyViewComponent,
    RealtimeChartComponent,
    StatComponent,
    InlineComponent,
    DirectivePipe,
    DebugComponent,
    HomeComponent,
    WizardComponent,
    DeployComponent,
    ManualComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChartsModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
