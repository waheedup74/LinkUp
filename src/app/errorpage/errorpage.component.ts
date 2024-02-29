import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.css']
})
export class ErrorpageComponent implements OnInit {

  errorMessage: string = "";

  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.errorMessage = this.activeRoute.snapshot.data['message'];
  }

}
