import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy';
import { ParsedPolicy } from '../models/recommendations';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  directives: string[]

  constructor(private http: HttpClient) {
    this.directives = ["default-src", "child-src", "connect-src", "font-src", "frame-src", "img-src", "manifest-src",
      "media-src", "object-src", "prefrech-src", "script-src", "style-src", "prefetch-src", "webrtc-src", "worker-src", "base-uri", "plugin-types",
      "sandbox", "disown-opener", "form-action", "frame-ancestors", "navigate-to", "report-uri", "report-to", "block-all-mixed-content",
      "referrer", "require-sri-for", "upgrade-insecure-requests"]
  }

  parsePolicy(policy: string): Observable<ParsedPolicy> {
    return this.http.post<ParsedPolicy>(`${environment.origin}/api/policies/parse`, { "policy": policy })
  }

  getPolicies(projectID: string): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${environment.origin}/api/projects/${projectID}/policies`)
  }

  getPoliciesStats(projectID: string): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${environment.origin}/api/projects/${projectID}/policies/stats`)
  }

  getPolicy(projectID: string, policyID: string): Observable<Policy> {
    return this.http.get<Policy>(`${environment.origin}/api/projects/${projectID}/policies/${policyID}`)
  }

  updatePolicy(policy: Policy): Observable<Policy> {
    return this.http.put<Policy>(`${environment.origin}/api/projects/${policy.projectID}/policies/${policy.id}`, policy)
  }

  savePolicy(policy: Policy): Observable<Policy> {
    return this.http.post<Policy>(`${environment.origin}/api/projects/${policy.projectID}/policies`, policy)
  }
}