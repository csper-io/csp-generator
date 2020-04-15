import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Report } from '../models/report';
import { Timeseries } from '../models/timeseries';
import { retryWhen, delay, tap, map, flatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ExtensionService } from './extension.service';
import { APIToken } from '../models/apitoken';
import { BuilderState } from '../models/builderstate';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  report$: WebSocketSubject<Report>

  constructor(private http: HttpClient, private extensionService: ExtensionService) { }

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

  closeReportWS() {
    if (this.report$) {
      this.report$.complete()
      this.report$ = null;
    }
  }

  getReportsWS(projectID: string): Observable<Report> {
    let origin = `${environment.wsOrigin}/api/projects/${projectID}/reports/ws`
    if (window.location.protocol == "http:") {
      origin = "ws://" + origin
    } else {
      origin = "wss://" + origin
    }

    return this.extensionService.getStateByProjectID(projectID).pipe(
      flatMap((apitoken: BuilderState) => {
        //@ts-ignore
        this.report$ = webSocket<Report>(origin)

        // @ts-ignore
        this.report$.next(apitoken)

        return this.report$.pipe(
          retryWhen(errors =>
            errors.pipe(
              tap(err => {
                console.error('Error reconnecting', err);

                // @ts-ignore
                this.report$.next(apitoken)
              }),
              delay(1000)
            )
          )
        )
      })
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