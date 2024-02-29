import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators, FormArray, NgModelGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  formType: boolean = false;

  formButtonTxt: string = "Reactive Form";
  name: string = '';
  email: string = '';
  defaultQuestion: string = "A";
  genders = ["male", "female"];
  forbiddenUserNames = ["chris", "ana"];

  @ViewChild('formObject') loginForm!: NgModelGroup;
  signupForm!: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'names': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'middlename': new FormControl(null),
        'lastname': new FormControl(null, Validators.required)
      }),
      'email': new FormControl(null, [Validators.required, Validators.email, this.forbiddenEmails()]),
      'secret': new FormControl(""),
      'gender': new FormControl('male'),
      'comment': new FormControl('Enter your suggestions'),
      'hobbies': new FormArray([])
    })
  }


  changeForm() {
    this.formType = !this.formType;
    if (this.formType) this.formButtonTxt = "Template Form";
    else this.formButtonTxt = "Reactive Form";
  }

  reactiveSubmit() {
  }

  addHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  forbiddenNames(control: FormControl): { [s: string]: boolean } | null {
    if (this.forbiddenUserNames.indexOf(control.value) !== -1) return { 'forbidden': true }
    return null;
  }

  forbiddenEmails(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === 'test@test.com') return { 'emailIsForbidden': true };
      else return null;
    }
  }

  // ************************* TEMPLATE DRIVEN FORM FUNCTIONS *****************************
  get hobbiesArray(): FormArray {
    return this.signupForm.get('hobbies') as FormArray;
  }

  resetForm() {
    this.signupForm.reset();
  }

  onSubmit(form: NgForm) {
    this.name = form.value.username;
    this.email = form.value.email;
  }

  onSubmitForVChild() {
    this.name = this.loginForm.value.username;
    this.email = this.loginForm.value.email;
  }

  testRouteNav() {
    this.router.navigate(['/footer'], { relativeTo: this.activatedRoute });
  }
}
