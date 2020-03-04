import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recommendations, Evaluation, BuilderRecommendations } from '../models/recommendations';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor(private http: HttpClient) { }

  // Deprecated
  getRecommendations(projectID: string, policyID: string): Observable<Recommendations> {
    return this.http.get<Recommendations>(`${environment.origin}/api/projects/${projectID}/policies/${policyID}/recommendations`)
  }

  applyRecommendationUpdates(rec: Recommendations): Observable<Recommendations> {
    return this.http.put<Recommendations>(`${environment.origin}/api/projects/${rec.projectID}/policies/${rec.policyID}/recommendations`, rec)
  }

  // Public Evaluations
  evaluate(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${environment.origin}/api/evaluations`, evaluation)
  }

  getEvaluation(evaluationID: string): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${environment.origin}/api/evaluations/${evaluationID}`)
  }

  getEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${environment.origin}/api/evaluations`)
  }

  // Project Evaluations
  getPolicyRecommendations(projectID: string, policyID: string): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${environment.origin}/api/projects/${projectID}/policies/${policyID}/recommendations/policy`)
  }

  getAllAcceptedBuilderRecommendations(projectID: string, policyID: string): Observable<BuilderRecommendations> {
    return this.http.get<BuilderRecommendations>(`${environment.origin}/api/projects/${projectID}/policies/${policyID}/recommendations/builder?acceptAll=true`)
  }

  // getBuilderRecommendations(projectID: string, policyID: string): Observable<BuilderRecommendations> {
  //   return this.http.get<BuilderRecommendations>(`${environment.origin}/api/projects/${projectID}/policies/${policyID}/recommendations/builder`)
  // }

  applyBuilderRecommendations(rec: BuilderRecommendations): Observable<BuilderRecommendations> {
    return this.http.put<BuilderRecommendations>(`${environment.origin}/api/projects/${rec.projectID}/policies/${rec.policyID}/recommendations/builder`, rec)
  }
}
