import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { CollectComponent } from './pages/collect/collect.component';
import { InlineComponent } from './pages/inline/inline.component';
import { DebugComponent } from './pages/debug/debug.component';
import { WizardComponent } from './pages/wizard/wizard.component';
import { DeployComponent } from './pages/deploy/deploy.component';
import { ManualComponent } from './pages/manual/manual.component';


const routes: Routes = [
  { path: '', redirectTo: 'wizard/start', pathMatch: 'full' },

  {
    path: 'wizard',
    component: WizardComponent,
    children: [
      { path: 'start', component: StartComponent },
      { path: 'collect', component: CollectComponent },
      { path: 'inline', component: InlineComponent },
      { path: 'deploy', component: DeployComponent },
    ]
  },

  { path: 'debug', component: DebugComponent },
  { path: 'manual', component: ManualComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    HttpClientModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
