import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendConnector } from '../services/backendconnector.service';
import { SharedDataService } from '../services/shared-data.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { LoginStatusService } from '../services/loginstatus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {

  loginSubscription: Subscription;

  dates: number[] = [];
  months: string[] = [];
  years: number[] = [];

  signupForm!: FormGroup;

  // Form input-fields validation variables
  nameValidationStatus: boolean = false;
  nameInputFieldError: boolean = false;

  emailValidationStatus: boolean = false;
  emailInputFieldError: boolean = false;

  genderValidationStatus: boolean = false;
  birthdayValidationStatus: boolean = false;
  passwordValidationStatus: boolean = false;
  passwordMatchStatus: boolean = false;

  activatedForm: number = 0;
  usernameErrorMsg: string = "";
  emailErrorMsg: string = "";
  message: string = "";
  passwordErrorMsg: string = "";
  friendSuggestionsLimit: number = 2;

  breakLineStatus: boolean = false;
  invalidPassword: boolean = false;
  invalidEmail: boolean = false;

  // variables used in 'Value- attribute' of input textfields
  emailFieldInputValue: string = "";
  passwordFieldInputValue: string = "";
  error: string = "";

  @ViewChild('date') date!: ElementRef;
  @ViewChild('month') month!: ElementRef;
  @ViewChild('year') year!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @ViewChild('cpassword') cpassword!: ElementRef;

  dateField !: ElementRef;
  monthField !: ElementRef;
  yearField !: ElementRef;
  passwordField !: ElementRef;
  cpasswordField !: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private backendService: BackendConnector,
    private router: Router,
    public session: SessionStorageService,
    private loginService: LoginStatusService,
    private shareService: SharedDataService,
  ) {

    this.shareService.generateYears();
    this.dates = this.shareService.dates;
    this.months = this.shareService.months;
    this.years = this.shareService.years;

    this.loginSubscription = this.loginService.updateActivatedForm.subscribe(
      (getActivatedForm: string) => {
        this.activatedForm = parseInt(getActivatedForm);
        this.message = "";
      });

    this.setSignUpDefaultValues();
  } //---- Constructor Ends --------------------------------------

  ngOnInit(): void {
    this.activatedForm = 0;
  }

  ngAfterViewInit(): void {
    this.dateField = this.date;
    this.monthField = this.month;
    this.yearField = this.year;
    this.passwordField = this.password;
    this.cpasswordField = this.cpassword;
  }

  onSignUp() {
    if (this.signupForm.value.gender == "gender") {
      if (this.signupForm.value.gender != null)
        this.genderValidationStatus = true;
      else
        this.genderValidationStatus = false;
    }

    if (this.signupForm.value.date == "" || this.signupForm.value.month == "" || this.signupForm.value.year == "")
      this.birthdayValidationStatus = true;
    else
      this.birthdayValidationStatus = false;

    const signUpdata = {
      'username': this.signupForm.value.username,
      'email': this.signupForm.value.email,
      'gender': this.signupForm.value.gender,
      'date': this.signupForm.value.date,
      'month': this.signupForm.value.month,
      'year': this.signupForm.value.year,
      'password': this.signupForm.value.password,
    };

    this.backendService.signUpRequest(signUpdata).subscribe(
      (responseStatus: any) => {
        if (!responseStatus.status) {
          if (responseStatus.message == "nametaken") {
            this.nameValidationStatus = this.nameInputFieldError = true;
            this.usernameErrorMsg = "Name already taken";
          }
          if (responseStatus.message == "emailtaken") {
            this.emailValidationStatus = this.emailInputFieldError = true;
            this.emailErrorMsg = "Email already taken";
          }
        }
        else {
          this.message = "signup successfull";
          this.setSignUpDefaultValues();
          this.router.navigate(['/']);
          this.removeMsg();
        }
      });
  }


  onLogin() {
    let email_username: string = '';
    let password: string = '';

    if (this.emailFieldInputValue != '' && this.emailFieldInputValue != null)
      email_username = this.emailFieldInputValue;

    if (this.passwordFieldInputValue != '' && this.passwordFieldInputValue != null)
      password = this.passwordFieldInputValue;

    if (email_username != "" || password != "") {
      this.backendService.signInRequest({ 'emailORusername': email_username, 'password': password }).subscribe(
        (signInStatusResponse: any) => {
          if (!signInStatusResponse.status) {
            this.message = "incorrect email/password";
            this.emailFieldInputValue = '';
            this.passwordFieldInputValue = '';
          }
          else {
            this.loginService.userLoggedIn();
            this.session.set("email", email_username);
            this.session.set("authUserId", signInStatusResponse.data.user_id);
            this.backendService.getFriendsData();
            this.loginService.setNextRouteName("landingpage/home");
            this.router.navigate(['landingpage/home']);
            this.emailFieldInputValue = '';
            this.passwordFieldInputValue = '';
          }
        }
      );
    }
  }

  // ****** SignUp Form Validation Functions **********************************************
  // Username Validation ---------------------------
  validateSignupName(element: HTMLInputElement) {
    this.nameInputFieldError = false;
    if (element.value.length > 0 && element.value.length < 3) {
      this.usernameErrorMsg = "name must be atleast 3 characters"
      this.nameValidationStatus = true;
    }
    else {
      this.usernameErrorMsg = "";
      this.nameValidationStatus = false;
    }
  }

  // Email Validation ------------------------------
  validateSignupEmail(element: HTMLInputElement) {
    this.emailInputFieldError = false;
    if (element.value != "" && this.signupForm.get('email')?.status == "INVALID") {
      this.emailErrorMsg = "invalid email address";
      this.emailValidationStatus = true;
    }
    else {
      this.emailErrorMsg = "";
      this.emailValidationStatus = false;
    }
  }

  // Birthday Validation ------------------------------
  validateSignupBirthdate() {
    if (this.dateField.nativeElement.value != "" && (this.signupForm.value.month == "" || this.signupForm.value.year == "")) {
      this.birthdayValidationStatus = true;
    }
    else {
      this.birthdayValidationStatus = false;
    }
  }
  validateSignupBirthmonth() {
    if (this.monthField.nativeElement.value != "" && (this.signupForm.value.date == "" || this.signupForm.value.year == "")) {
      this.birthdayValidationStatus = true;
    }
    else {
      this.birthdayValidationStatus = false;
    }
  }
  validateSignupBirthyear() {
    if (this.yearField.nativeElement.value != "" && (this.signupForm.value.date == "" || this.signupForm.value.month == "")) {
      this.birthdayValidationStatus = true;
    }
    else {
      this.birthdayValidationStatus = false;
    }
  }

  // Password Validation ----------------------------
  validateSignupPassword() {
    this.message = '';

    if (this.passwordField.nativeElement.value.length == 0) {
      this.breakLineStatus = false;
    }
    if ((this.passwordField.nativeElement.value.length > 0 && this.passwordField.nativeElement.value.length < 5) && this.signupForm.value.confirmpassword == "") {
      this.passwordMatchStatus = false;
    }
    if (this.passwordField.nativeElement.value == this.signupForm.value.confirmpassword) {
      this.breakLineStatus = false;
      this.passwordMatchStatus = false;
      this.passwordValidationStatus = false;
    }

    if (this.passwordField.nativeElement.value.length > 0 && this.passwordField.nativeElement.value.length < 5) {
      this.breakLineStatus = true;
      this.passwordValidationStatus = true;
    }
    else if (this.passwordField.nativeElement.value.length > 0 && this.passwordField.nativeElement.value != this.signupForm.value.confirmpassword) {
      this.breakLineStatus = false;
      this.passwordMatchStatus = true;
      this.passwordValidationStatus = false;
    }
    else {
      this.passwordValidationStatus = false;
    }
  }

  // Confirm Password Validation ---------------------------
  validateSignupConfirmPassword() {
    if (this.passwordField != null) {
      if (this.cpasswordField.nativeElement.value != "") {
        if (this.passwordField.nativeElement.value != this.cpasswordField.nativeElement.value && this.passwordField.nativeElement.value != "")
          this.passwordMatchStatus = true;
        else
          this.passwordMatchStatus = false;
      }
      else if (this.cpasswordField.nativeElement.value == "" && this.passwordField.nativeElement.value != "") {
        this.passwordMatchStatus = true;
      }
      else {
        this.passwordMatchStatus = false;
      }
    }
  }

  // **** SignIn Form Validation Functions ******************************************************
  validateSigninEmail(element: HTMLInputElement) {
    this.message = '';
    this.emailFieldInputValue = '';

    if (element.value.length >= 3) {
      this.invalidEmail = false;
    }
    else {
      this.invalidEmail = true;
    }
  }

  validateSigninPassword(element: HTMLInputElement) {
    this.message = '';
    this.passwordFieldInputValue = '';

    if (element.value.length >= 5) {
      this.invalidPassword = false;
    }
    else {
      this.invalidPassword = true;
    }
  }
  // *******************************************************************************************

  setSignUpDefaultValues() {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.minLength(3), Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['male', [Validators.required]],
      date: ['', [Validators.required]],
      month: ['', [Validators.required]],
      year: ['', [Validators.required]],
      password: ['', [Validators.minLength(5), Validators.required]],
      confirmpassword: ['', [Validators.required]]
    });
  }

  removeMsg() {
    setTimeout(() => { this.message = ""; }, 1500);
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }

}
