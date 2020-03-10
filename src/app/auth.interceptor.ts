import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ExtensionService } from './services/extension.service';
import { APIToken } from './models/apitoken';
import { environment } from 'src/environments/environment';
import { BuilderState } from './models/builderstate';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private extensionService: ExtensionService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let projectID = ""

        if (request.url.startsWith(environment.origin + "/api/projects/")) {
            var start = (environment.origin + "/api/projects/").length
            projectID = request.url.substring(start, start + 24)
        }

        console.log("auth.interceptor.ts projectID:", projectID)

        if (projectID.length == 24 && projectID.match(/^[0-9a-z]+$/)) {
            console.log("auth.interceptor.ts match!")
            return this.extensionService.getStateByProjectID(projectID).pipe(
                tap((token: BuilderState) => {
                    console.log("[+] auth.interceptor.ts: projectID", projectID, "token", token)
                }),
                mergeMap((apitoken: BuilderState) => {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${apitoken.id}:${apitoken.token}`
                        }
                    });
                    return next.handle(request);
                })
            )
        }

        return next.handle(request);
    }
}
