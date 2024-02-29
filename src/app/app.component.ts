import { Component } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  loading: boolean = false;
  loadingTxt: string = "Loading ...";

  constructor(router: Router) {
    router.events.subscribe(
      (event) => {
        if (event instanceof RouteConfigLoadStart) {
          this.loading = true;
          this.loadingTxt = "Loading ...";
        } else if (event instanceof RouteConfigLoadEnd) {
          this.loading = false;
          this.loadingTxt = "";
        }
      });
  }

}