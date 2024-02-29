import { Attribute, Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { AsyncValidatorFn, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PopupComponent } from 'src/app/modals/popup/popup.component';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  standalone: false,
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {

  public signupFormGroup: UntypedFormGroup;
  forbiddenUserNamesList = ["aaa", "bbb"];

  constructor(
    private notificationService: NotificationsService,
    public viewRef: ViewContainerRef,
    @Attribute('type') public type: string
    ) {
    this.type = 'button'
    this.signupFormGroup = new UntypedFormGroup({
      'username': new UntypedFormControl("", [Validators.required, this.forbiddenNames.bind(this), Validators.minLength(3)]),
      'password': new UntypedFormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(25)], <AsyncValidatorFn>this.forbiddenPassword),
      'additionalUserdata': new UntypedFormGroup({
        'bio': new UntypedFormControl("", Validators.minLength(10)),
        'additionalBio': new UntypedFormArray([])
      }),

      'myexperience': new UntypedFormArray([]),
      'myphotoes': new UntypedFormArray([])
    });

    // this.signupFormGroup.statusChanges.subscribe(
    //   (status) => {
    //     console.log("statusChanges: ", status);
    //   });
  }

  ngOnInit(): void {
    this.notificationService.containerElementViewRef = this.viewRef;
  }

  public showDialog() {
    let popup_data = {
      "title": this.signupFormGroup.controls["username"].value,
      "description": this.signupFormGroup.controls["password"].value,
    };

    this.notificationService.newNotification(PopupComponent, popup_data);
  }

  public onSubmit() {
  }

  public addExperince() {
    const _fc = new UntypedFormControl(null);
    (<UntypedFormArray>(this.signupFormGroup.get('myexperience'))).push(_fc);
  }
  myexperienceControls() {
    return (this.signupFormGroup.get('myexperience') as UntypedFormArray).controls;
  }

  public addAdditionalBio() {
    const _fc = new UntypedFormControl(null);
    (this.signupFormGroup.get('additionalUserdata.additionalBio') as UntypedFormArray).push(_fc);
  }
  myAdditionalBioControls() {
    return (this.signupFormGroup.get('additionalUserdata.additionalBio') as UntypedFormArray).controls;
  }

  public addPhotoes() {
    const _fc = new UntypedFormControl(null);
    (this.signupFormGroup.get('myphotoes') as UntypedFormArray).push(_fc);
  }
  myphotoesControls() {
    return (this.signupFormGroup.get('myphotoes') as UntypedFormArray).controls;
  }

  forbiddenNames(control: UntypedFormControl): { [s: string]: boolean } | null {
    if (this.forbiddenUserNamesList.indexOf(control.value) !== -1) {
      return { 'nameNotAllowed': true };
    }
    return null;
  }

  forbiddenPassword(control: UntypedFormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>(
      (resolve, rej) => {
        setTimeout(() => {
          if (control.value === '1234') {
            resolve({ 'passwordNotAllowed': true });
          }
          else resolve(null);
        }, 500);
      });

    return promise;
  }

}
