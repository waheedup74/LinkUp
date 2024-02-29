import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {

  routeSubscription!: Subscription;
  searchText: string = "";

  groupsData = [
    {'groupName': 'aaa', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'bbb', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'ccc', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'ddd', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'eee', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'fff', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'ggg', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'hhh', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'iii', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'firebite', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'dreamgames', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'talksns', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'bitefiregames', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'games', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'arcade games', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'websites', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'top websites', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'android games', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
    {'groupName': 'web technologies', 'groupDesc': '... nothing ...', 'createdAt': new Date()},
  ];

  pageNo = [
    { no : 1},
    { no : 2},
    { no : 3},
    { no : 4},
    { no : 5}
  ];

  perPageLimit: number = 5;

  currentLoadedPage : number = 0;
  initialPage: number = 5;
  maxLimit: number = 0;
  group!: { no: number };
  rightPanelNo: number = 0;
  selectedPageNo: number = 0;

  renderAgain: boolean = true;

  groupStatus = new Promise ((resolve, rej)=> {
    setTimeout(() => {
      resolve('Loading Done');
    }, 2000);
  })

  constructor(private activatedRouter: ActivatedRoute, private router: Router) { }

  ngOnInit(): void { 
    this.group = {
      no: this.activatedRouter.snapshot.params['pageNo']
    };
    
    this.routeSubscription = this.activatedRouter.params.subscribe(
      (param: Params) => {
        this.group.no = param['pageNo'];
        this.currentLoadedPage = param['pageNo'];

        if (this.group.no != 0)
          this.initialPage = 5 * (this.group.no - 1);
      }
    );

    this.activatedRouter.queryParams.subscribe(
      (qParam: Params) => {
        this.maxLimit = qParam['limit'];
        this.renderAgain = true;
      }
    );
  }

  loadPage(pageNo: number){
    if (this.currentLoadedPage != pageNo)   this.renderAgain = false;
    this.router.navigate(['/landingpage/groups/'+ pageNo], {queryParams: {'limit': 5 * pageNo}});
  }

  setPageNo(pageNo: number){
    this.selectedPageNo = pageNo;
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
