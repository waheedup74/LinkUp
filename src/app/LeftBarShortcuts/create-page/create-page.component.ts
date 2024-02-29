import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendConnector } from '../../services/backendconnector.service';
import { Router } from '@angular/router';
import { LoginStatusService } from '../../services/loginstatus.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css']
})

export class CreatePageComponent implements OnInit {

  createpageForm: FormGroup;

  pageNameValidationStatus: boolean = false;
  pageNameInputFieldError: boolean = false;
  pageUrlValidationStatus: boolean = false;
  pageUrlInputFieldError: boolean = false;
  pageDescValidationStatus: boolean = false;
  pageDescInputFieldError: boolean = false;
  pagePicture: File | null = null;

  pageNameErrorMessage: string = "";
  pageUrlErrorMessage: string = "";
  pageDescErrorMessage: string = "";
  imageSrc: string = "";

  @ViewChild('pagedesc') pagedesc_input!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private connector: BackendConnector,
    private router: Router,
    private loginService: LoginStatusService
  ) {
    this.createpageForm = this.formBuilder.group({
      pagename: ['', Validators.required],
      pageurl: ['', Validators.required],
      pagedesc: ['', Validators.required],
      pagecat: ['1', Validators.required]
    });
  }

  ngOnInit() { }

  get f() { return this.createpageForm.controls; }

  onPagePicture(event: Event) {
    if (event && event.target && event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0)
      this.pagePicture = <File>event.target.files[0];

    // if(event.target.files && event.target.files[0])
    // {
    //   const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.onload = e => this.imageSrc = reader.result as string;
    //   reader.readAsDataURL(file);
    // }
  }

  onSubmit() {
    if (this.createpageForm.invalid) return;

    const createPageData = {
      'pagename': this.createpageForm.value.pagename,
      'pageurl': this.createpageForm.value.pageurl,
      'pagecat': this.createpageForm.value.pagecat,
      'pagedesc': this.createpageForm.value.pagedesc
    };

    this.connector.setCreatePage(createPageData, this.pagePicture);

    this.router.navigate(['shortcuts/mypage']);
  }

  validateName(element: HTMLInputElement) {
    this.pageNameInputFieldError = false;
    if (element.value == "") {
      this.pageNameValidationStatus = true;
      this.pageNameErrorMessage = "Page Name is required";
    } else {
      this.pageNameValidationStatus = false;
      this.pageNameErrorMessage = '';
    }
  }

  validateURL(element: HTMLInputElement) {
    this.pageUrlInputFieldError = false;
    if (element.value == "") {
      this.pageUrlValidationStatus = true;
      this.pageUrlErrorMessage = "Page Url is required";
    } else {
      this.pageUrlValidationStatus = false;
      this.pageUrlErrorMessage = '';
    }
  }

  validateDescription() {
    this.pageDescInputFieldError = false;
    if (this.pagedesc_input.nativeElement.value == "") {
      this.pageDescValidationStatus = true;
      this.pageDescErrorMessage = "Page Description is required";
    } else {
      this.pageDescValidationStatus = false;
      this.pageDescErrorMessage = '';
    }
  }

  public SetNextRoute(nextRoute: string) {
    this.loginService.setNextRouteName(nextRoute);
  }

}
