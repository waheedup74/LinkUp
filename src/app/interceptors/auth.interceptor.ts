import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifiedReq = req.clone({
            headers: req.headers.set("X-localization", "english"),
        });

        let authReq = modifiedReq;
        const token = localStorage.getItem("token");
        if (token !== null) {
            authReq = this.addTokenHeader(req, token);
        }
        return next.handle(this.addTokenHeader(req, token+''));
    }

    private addTokenHeader(request: HttpRequest<any>, token: string) {
        return request.clone({ headers: request.headers.set("Authorization", `Bearer ${token}`) });
    }
}
