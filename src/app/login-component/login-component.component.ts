import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginStatusService } from '../services/loginstatus.service';
import { SessionStorageService } from 'angular-web-storage';
import { BackendConnector } from '../services/backendconnector.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  userId: number = 0;
  loginFormType: number = 0;

  emailFieldInputValue: string = "";
  passwordFieldInputValue: string = "";
  message: string = "";

  passwordValidationStatus: boolean = false;
  passwordMatchStatus: boolean = false;
  isUserLoggedIn!: boolean;
  invalidPassword: boolean = false;
  invalidEmail: boolean = false;

  tempFormValues = {};
  @ViewChild('signinSecondForm') signinSecondForm!: NgForm;
  @ViewChild('signinFirstForm') signinFirstForm!: NgForm;
  @ViewChild('password') passwordField!: ElementRef;

  constructor(
    private connectorService: BackendConnector,
    private loginService: LoginStatusService,
    private router: Router,
    public session: SessionStorageService
  ) {
    if (localStorage.getItem('routerUrl') != null)
      this.router.navigate(["/" + localStorage.getItem('routerUrl')]);
  }

  ngOnInit(): void {
    this.userId = parseInt(this.session.get('authUserId'));
    this.loginFormType = 0;
    this.isUserLoggedIn = this.loginService.isUserLoggedIn();

    this.loginService.userLoginStatus.subscribe(
      (userLoginStatus: boolean) => {
        this.isUserLoggedIn = userLoginStatus;
      }
    );
  }


  onSignIn(form: NgForm) {
    const EmailorUsername = form.value.emailUsername;
    const password = form.value.password;

    if (!form.valid) {
      this.loginFormType = 1;

      this.signinSecondForm.setValue({
        "emailUsername": EmailorUsername,
        "password": password,
      });
      this.tempFormValues = { "emailUsername": EmailorUsername, "password": password };

      this.loginService.setForm(this.loginFormType);
    }

    else {
      this.connectorService.signInRequest({ 'emailORusername': EmailorUsername, 'password': password }).subscribe(
        (signInStatus: any) => {

          if (!signInStatus.status) this.loginService.setForm(this.loginFormType);
          else {
            if (this.loginFormType == 1) this.loginService.setForm(1);
            this.isUserLoggedIn = true;
            this.loginService.userLoggedIn();
            this.loginService.loggedUserData = signInStatus.data;
            this.session.set("email", EmailorUsername);
            this.session.set("authUserId", signInStatus.data.user_id);
            this.connectorService.getFriendsData();
            this.router.navigate(['landingpage/home']);
          }
        });
    }
  }

  updateFormValues(form: NgForm) {
    this.tempFormValues = { "emailUsername": form.value.emailUsername, "password": form.value.password };
  }

  LoadSignUp() {
    this.loginFormType = 0;
    this.signinFirstForm.setValue(this.tempFormValues);
    this.loginService.setForm(this.loginFormType);
  }

  LoadSignInForm() {
    this.loginService.setForm(this.loginFormType);
  }

  validateSignupConfirmPassword(element: HTMLInputElement) {
    if (this.passwordField != null) {
      if (element.value != "") {
        if (this.passwordField.nativeElement.value != element.value && this.passwordField.nativeElement.value != "")
          this.passwordMatchStatus = true;
        else
          this.passwordMatchStatus = false;
      }
      else if (element.value == "" && this.passwordField.nativeElement.value != "")
        this.passwordMatchStatus = true;

      else this.passwordMatchStatus = false;
    }
  }

  validateSigninEmail(element: HTMLInputElement) {
    this.message = '';
    this.emailFieldInputValue = '';

    if (element.value.length >= 3) this.invalidEmail = false;
    else this.invalidEmail = true;
  }

  validateSigninPassword(element: HTMLInputElement) {
    this.message = '';
    this.passwordFieldInputValue = '';

    if (element.value.length >= 5) this.invalidPassword = false;
    else this.invalidPassword = true;
  }
}
