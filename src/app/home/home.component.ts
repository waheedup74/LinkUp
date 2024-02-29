import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  message = 'Nothing found';
  submitBtn = 'Submit';
  marks = [73, 91, 23, 55, 42, 68];

  constructor(){}

  upload(){
    this.submitBtn = 'Submitted';

    setTimeout(() => {
      this.submitBtn = 'Submitted';
    }, 3000);
  }
}
