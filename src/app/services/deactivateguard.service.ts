import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
class DeactivateGuard {
    canDeactivate(
        comp: any,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ) {
        return true;
    }
}

export const deactivateGuard: CanDeactivateFn<boolean> =
    (comp: any, route: ActivatedRouteSnapshot, currentRoutestate: RouterStateSnapshot, nextRoutestate: RouterStateSnapshot): boolean => {
        return inject(DeactivateGuard).canDeactivate(comp, route, currentRoutestate, nextRoutestate);
    }