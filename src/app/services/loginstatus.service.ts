import { Injectable, EventEmitter } from "@angular/core";
import { SessionStorageService } from "angular-web-storage";
import { Subject } from "rxjs";
import { Router } from '@angular/router';

@Injectable()
export class LoginStatusService {

    public nextRouteName: string = "";
    private isLoggedIn: boolean = false;
    public loggedUserData = null;
    private activatedForm: string;

    userLoginStatus = new EventEmitter<boolean>();

    updateActivatedForm = new Subject<string>();

    constructor(
        private session: SessionStorageService,
        private router: Router) {
        this.activatedForm = "";
    }

    public setForm(formNo: number) {
        localStorage.setItem("activatedForm", formNo + '');
        this.activatedForm = formNo + '';
        this.updateActivatedForm.next(this.activatedForm);
    }

    // *** Related to User Logged In Status **********************
    public userLoggedIn() {
        this.isLoggedIn = true;
        this.userLoginStatus.emit(this.isLoggedIn);
    }

    signOut() {
        this.session.remove("authUserId");
        this.session.remove("email");
        this.userLoggedOut();
        this.removeRouteData();
        this.router.navigate(['/']);
    }

    public userLoggedOut() {
        this.isLoggedIn = false;
        this.userLoginStatus.emit(this.isLoggedIn);
    }

    public isUserLoggedIn() {
        if (this.session.get('email') != null && this.session.get('email') != '') this.userLoggedIn();
        else this.userLoggedOut();

        return this.isLoggedIn;
    }

    public getuserLogedinStatus() {
        return this.isLoggedIn;
    }

    //--- Store the Routes-Path in LocalStorage to load it, on refreshing the page ------------------
    public setNextRouteName(nextRoute: string) {
        this.nextRouteName = nextRoute;
        localStorage.setItem("routerUrl", this.nextRouteName);
    }

    public getNextRouteName() {
        return this.nextRouteName;
    }

    public removeRouteData() {
        this.nextRouteName = '/';
        localStorage.setItem("routerUrl", this.nextRouteName);
    }
    //------------------------------------------------------------------------------------------------
}