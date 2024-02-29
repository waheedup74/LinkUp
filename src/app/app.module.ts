// ********** MODULES ****************************************
import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// ********** SERVICES **************************************
import { SocketService } from './services/socket.service';
import { AngularWebStorageModule } from 'angular-web-storage';

// ********** COMPONENTS *************************************
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BackendConnector } from './services/backendconnector.service';
import { LoginStatusService } from './services/loginstatus.service';
import { AppRoutingModule } from './app-routing.module';
import { SharedDataService } from './services/shared-data.service';
import { LoginComponentComponent } from './login-component/login-component.component';
import { HighlightDirective } from './directives/highlight.directive';
import { PropertyCheckDirective } from './directives/property-check.directive';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { StoreModule } from '@ngrx/store';
import { landingpageReducer } from './landingpage/landingpage.reducer';
import { MultiFileUploadComponent } from './multi-file-upload/multi-file-upload.component';
import { MainLayoutComponent } from './main_layout/main-layout.component';
import { FileUploadComponent } from './file-upload/file-upload.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponentComponent,
    HighlightDirective,
    PropertyCheckDirective,
    ErrorpageComponent,
    MultiFileUploadComponent,
    FileUploadComponent,
    MainLayoutComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularWebStorageModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ 'userGroups': landingpageReducer }, {})
  ],

  providers: [
    BackendConnector,
    LoginStatusService,
    SocketService,
    SharedDataService,
    // {
    //   provide: HTTP_INTERCEPTORS, //identifier of http inteceptor
    //   useClass: authInterceptorService, //class that will be intercepted
    //   multi: true  // for multiple inteceptors
    // }
    // {
    //   provide: HTTP_INTERCEPTORS, //identifier of http inteceptor
    //   useClass: loggingInterceptorService, //class that will be intercepted
    //   multi: true  // for multiple inteceptors
    // }
  ],

  bootstrap: [AppComponent],
  exports: []

})
export class AppModule { }
