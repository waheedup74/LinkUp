import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteLinksService {

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute
  ) { }

  loadHome() {
    this.router.navigate(['/landingpage/home']);
  }

  loadTimeline() {
    this.router.navigate(['/landingpage/timeline']);
  }

  loadCreatePate() {
    this.router.navigate(['/shortcuts/create-page']);
  }

  loadFriendSection() {
    this.router.navigate(['/shortcuts/friendsection']);
  }

  loadGroupsPage() {
    this.router.navigate(['/landingpage/groups/1']);
  }

  loadMyPage() {
    this.router.navigate(['/shortcuts/mypage']);
  }
}
