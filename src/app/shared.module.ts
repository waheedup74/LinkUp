import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ShortenPipe } from './shared/shorten.pipe';
import { FilterPipe } from './shared/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatapointComponent } from './shared/datapoint/datapoint.component';


@NgModule({
  declarations: [
    LeftPanelComponent,
    RightPanelComponent,
    PageNotFoundComponent,
    ShortenPipe,
    FilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DatapointComponent
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    // }
  ],
  exports: [
    LeftPanelComponent,
    RightPanelComponent,
    PageNotFoundComponent,
    ShortenPipe,
    FilterPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatapointComponent
  ]
})
export class SharedModule { }
