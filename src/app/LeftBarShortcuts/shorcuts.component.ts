import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginStatusService } from '../services/loginstatus.service';

@Component({
  selector: 'app-shorcuts',
  templateUrl: './shorcuts.component.html',
  styleUrls: ['./shorcuts.component.css']
})
export class ShorcutsComponent implements OnInit {

  public activeInPage: boolean;
  rightPanelNo: number = 0;

  constructor(private loginService: LoginStatusService, private router: Router) {
    this.activeInPage = false;
   }

  ngOnInit() {}

  onPagesLoad(nextRoute: string){
    this.loginService.setNextRouteName(nextRoute);
    this.router.navigate(['shortcuts/mypage']);
  }

}
