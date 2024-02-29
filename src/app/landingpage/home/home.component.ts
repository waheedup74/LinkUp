import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginStatusService } from '../../services/loginstatus.service';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {

  rightPanelNo: number = 0;
  userId: number = 0;
  showPostStatus: number = 0; // 0- All, 1- My Posts, 2- Friends Only, 3- Page Posts Only

  constructor(
    private loginService: LoginStatusService,
    public session: SessionStorageService) {
  }

  ngOnInit() {
  }

  setNextRoute(nextRoute: string) {
    this.loginService.setNextRouteName(nextRoute);
  }
  
  canDeactivateInterface(nextUrl: string): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loginService.isUserLoggedIn() && nextUrl == "/") return false;
    else return true;
  }

  ngOnDestroy() { }
}
