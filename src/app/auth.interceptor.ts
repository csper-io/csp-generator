import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APITokenService } from './services/apitoken.service'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenService: APITokenService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let projectID = ""
        if (request.url.startsWith("/api/projects/")) {
            projectID = request.url.substring("/api/projects/".length, "/api/projects/".length + 24)
        }

        if (projectID.length == 24 && this.tokenService.isKnownProjectID(projectID)) {
            let apitoken = this.tokenService.getTokenByProjectID(projectID)

            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${apitoken.id}:${apitoken.token}`
                }
            });
        }

        return next.handle(request);
    }
}
