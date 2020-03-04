import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Report } from '../models/report';
import { Timeseries } from '../models/timeseries';
import { retryWhen, delay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APITokenService } from './apitoken.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, private tokenService: APITokenService) { }

  getReports(projectID: string, group: boolean): Observable<Report[]> {
    return this.http.get<Report[]>(`${environment.origin}/api/projects/${projectID}/reports?group=${group}`)
  }

  getReportsFiltered(projectID: string, policyID: string, hash: string, isGroup: boolean, bucket: string, directive: string, limit: number, page: number) {
    return this.http.get<Report[]>(`${environment.origin}/api/projects/${projectID}/reports?policy=${policyID}&bucket=${bucket}&hash=${hash}&group=${isGroup}&directive=${directive}&limit=${limit}&page=${page}`)
  }

  countReports(projectID: string, policyID: string, hash: string): Observable<Report> {
    return this.http.get<Report>(`${environment.origin}/api/projects/${projectID}/reports/count?policy=${policyID}&hash=${hash}`)
  }

  getReportsForPolicy(projectID: string, policyID: string, group: boolean): Observable<Report[]> {
    return this.http.get<Report[]>(`${environment.origin}/api/projects/${projectID}/reports?policy=${policyID}&group=${group}`)
  }

  getReportsForHash(projectID: string, policyID: string, hash: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${environment.origin}/api/projects/${projectID}/reports?policy=${policyID}&hash=${hash}`)
  }

  getReportsWS(projectID: string): Observable<Report> {
    let origin = `${environment.wsOrigin}/api/projects/${projectID}/reports/ws`
    if (window.location.protocol == "http:") {
      origin = "ws://" + origin
    } else {
      origin = "wss://" + origin
    }

    let apitoken = this.tokenService.getTokenByProjectID(projectID)

    let subject = webSocket<Report>(origin)
    // @ts-ignore
    subject.next(apitoken)

    return subject.pipe(
      retryWhen(errors =>
        errors.pipe(
          tap(err => {
            console.error('Error reconnecting', err);

            // @ts-ignore
            subject.next(apitoken)
          }),
          delay(1000)
        )
      )
    )
  }

  //  getReportsFiltered(projectID: string, policyID: string, hash: string, isGroup: boolean, bucket: string, directive: string, limit: number, page: number) {
  getReportTimeseries(projectID: string, policyID: string, hash: string, isGroup: boolean, bucket: string, directive: string): Observable<Timeseries> {
    return this.http.get<Timeseries>(`${environment.origin}/api/projects/${projectID}/reports/timeseries?policy=${policyID}&bucket=${bucket}&hash=${hash}&group=${isGroup}&directive=${directive}`)
  }

  insertSampleReports(projectID: string): Observable<any> {
    return this.http.post(`${environment.origin}/api/projects/${projectID}/reports/sample`, "", { responseType: 'text' })
  }

  deleteReports(projectID: string): Observable<any> {
    return this.http.delete(`${environment.origin}/api/projects/${projectID}/reports`, { responseType: 'text' })
  }
}