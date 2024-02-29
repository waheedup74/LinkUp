import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from "@angular/router";
import { Injectable, inject } from "@angular/core";

import { LoginStatusService } from "./loginstatus.service";

@Injectable({
    providedIn: 'root'
})
class PermissionsService {
    constructor(private router: Router, private loginService: LoginStatusService) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.loginService.isUserLoggedIn()) return true;

        this.router.navigate(['/']);
        return false;
    }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(PermissionsService).canActivate(next, state);
}
