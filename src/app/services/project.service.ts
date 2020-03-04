import { Injectable } from '@angular/core';
import { Project, ProjectInvite } from '../models/project';
import { APIToken } from '../models/apitoken';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Overview } from '../models/overview';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  newTempProject(name: string): Observable<APIToken> {
    let newProject: Project = {
      name: name,
      planName: "TEMP",
    } as Project

    return this.http.post<APIToken>(`${environment.origin}/api/projects/temp`, newProject)
  }

  getProject(projectID: string): Observable<Project> {
    return this.http.get<Project>(`${environment.origin}/api/projects/${projectID}`)
  }

  getProjectOverview(id: string): Observable<Overview> {
    return this.http.get<Overview>(`${environment.origin}/api/projects/${id}/overview`)
  }

  createInviteLink(projectID: string): Observable<ProjectInvite> {
    return this.http.post<ProjectInvite>(`${environment.origin}/api/projects/${projectID}/inviteLink`, { "role": "ADMIN" })
  }
}
