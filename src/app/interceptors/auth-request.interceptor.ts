import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';


import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthRequestInterceptor implements HttpInterceptor {

    excludedEndpoints = [
        "/login",
        "/forgot-password"
    ];

    constructor(
        private cookieService: CookieService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const excludeRequest = this.excludedEndpoints.find(endpoint => request.url.includes(endpoint));
        if (excludeRequest) return next.handle(request);

        const token = this.cookieService.get('DWS-XSRF-TOKEN');
        const validXSRFToken = token ? token : '';

        const modifiedRequest = request.clone({
            headers: request.headers.set('X-XSRF-TOKEN', validXSRFToken),
        });

        return next.handle(modifiedRequest);
    }
}
