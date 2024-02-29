import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../services/authguard.service';
import { deactivateGuard } from '../services/deactivateguard.service';
import { ReversePipe } from '../shared/reverse.pipe';
import { ClearspaceDirective } from '../shared/clearspace.directive';
import { DropdownDirective } from '../shared/dropdown.directive';

import { HomeComponent } from './home/home.component';
import { LandingpageComponent } from '../landingpage/landingpage.component';
import { TimelineComponent } from '../landingpage/timeline/timeline.component';
import { CreateQuestionairComponent } from './create-questionair/create-questionair.component';
import { AllPostsComponent } from './all-posts/all-posts.component';
import { SharedModule } from '../shared.module';
import { GroupsComponent } from './groups/groups.component';
import { GroupComponent } from './groups/group/group.component';
import { ErrorpageComponent } from '../errorpage/errorpage.component';
import { CreatePdfComponent } from './create-pdf/createPdf.component';


const timelineRoutes: Routes = [
  {
    path: '', canActivate: [AuthGuard], component: LandingpageComponent, children: [
      { path: 'home', component: HomeComponent, canDeactivate: [deactivateGuard] },
      { path: 'timeline', component: TimelineComponent },
      { path: 'create-questionair', component: CreateQuestionairComponent },
      {
        path: 'groups', component: GroupsComponent, children: [
          { path: ':pageNo', component: GroupComponent }
        ]
      }
    ]
  },
  { path: 'error', component: ErrorpageComponent, data: { messsage: 'Page not found!' } },
  { path: '**', redirectTo: '/landingpage/404' },
]

@NgModule({
  
  declarations: [
    HomeComponent,
    LandingpageComponent,
    TimelineComponent,
    ReversePipe,
    ClearspaceDirective,
    DropdownDirective,
    AllPostsComponent,
    GroupsComponent,
    GroupComponent,
    CreateQuestionairComponent,
    CreatePdfComponent
  ],
  
  imports: [
    SharedModule,
    RouterModule.forChild(timelineRoutes)
  ],
  exports: [RouterModule]
})
export class TimelineModule { }
