import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { ShorcutsComponent } from '../../LeftBarShortcuts/shorcuts.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css']
})
export class PageHomeComponent implements OnInit {

  isPagePic: boolean = false;
  pageData: any;
  userId: number = 0;
  @Output() pageWasSelected = new EventEmitter<number>();

  constructor(
    private activePage: ShorcutsComponent,
    public session: SessionStorageService,
    private activatedRouter: ActivatedRoute
  ) {
    this.activePage.activeInPage = false;
  }

  ngOnInit() {
    this.userId = this.session.get('authUserId');
    
    this.activatedRouter.data.subscribe(
      (data: any) => {
        this.pageData = data['pageResolver'][0];
      }
    );
  }

  onPageWasSelect(pageId: number) {
    this.pageWasSelected.emit(pageId);
  }

  pagePicFound() {
    this.isPagePic = true;
  }
  pagePicNotFound() {
    this.isPagePic = false;
  }

}


