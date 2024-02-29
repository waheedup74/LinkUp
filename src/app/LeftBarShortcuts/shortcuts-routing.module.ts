import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsectionComponent } from './friendsection/friendsection.component';
import { ShorcutsComponent } from './shorcuts.component';
import { MypageComponent } from './mypage/mypage.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { CreatePageComponent } from './create-page/create-page.component';

import { paginationResolver } from '../resolvers/pagination.service';
import { SharedModule } from '../shared.module';


const routes: Routes = [
  {
    path: '', component: ShorcutsComponent, children: [
      { path: 'friendsection', component: FriendsectionComponent },
      { path: 'mypage', component: MypageComponent },
      { path: 'page-home/:pageId/:page_name', component: PageHomeComponent, resolve: { pageResolver: paginationResolver } },
      { path: 'create-page', component: CreatePageComponent }
    ]
  }
];

@NgModule({
  declarations: [
    FriendsectionComponent,
    ShorcutsComponent,
    MypageComponent,
    PageHomeComponent,
    CreatePageComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  
  exports: [RouterModule]
})
export class ShortcutsRoutingModule { }
