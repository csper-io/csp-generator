import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './pages/start/start.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectComponent } from './pages/project/project.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth.interceptor';
import { CollectComponent } from './pages/collect/collect.component';

import { PolicyViewComponent } from './components/policy-view/policy-view.component';
import { ReportChartComponent } from './components/report-chart/report-chart.component';
import { StatComponent } from './components/stat/stat.component';


import { ChartsModule } from 'ng2-charts';
import { RealtimeChartComponent } from './components/realtime-chart/realtime-chart.component';
import { BuildComponent } from './pages/build/build.component';
import { NextComponent } from './pages/next/next.component';
import { InlineComponent } from './pages/inline/inline.component';
import { DirectivePipe } from './pipes/directive.pipe';


@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    ProjectsComponent,
    ProjectComponent,
    CollectComponent,

    PolicyViewComponent,
    ReportChartComponent,
    RealtimeChartComponent,
    BuildComponent,
    NextComponent,
    StatComponent,
    InlineComponent,
    DirectivePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChartsModule,
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
