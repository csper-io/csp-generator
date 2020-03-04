import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectComponent } from './pages/project/project.component';
import { CollectComponent } from './pages/collect/collect.component';
import { BuildComponent } from './pages/build/build.component';
import { NextComponent } from './pages/next/next.component';
import { InlineComponent } from './pages/inline/inline.component';


const routes: Routes = [
  { path: 'projects', component: ProjectsComponent },
  { path: 'project/:projectID', component: ProjectComponent },

  { path: '', component: StartComponent },
  { path: 'collect/:projectID', component: CollectComponent },
  { path: 'inline/:projectID', component: InlineComponent },
  { path: 'next/:projectID', component: NextComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    HttpClientModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
