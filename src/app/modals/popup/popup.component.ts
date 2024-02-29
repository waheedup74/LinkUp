import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})

// AfterViewInit, OnChanges, DoCheck, AfterContentChecked, AfterContentInit, AfterViewChecked, OnDestroy
export class PopupComponent implements OnDestroy {

  @Input({ required: false }) description: any;
  @Input({ required: false }) headingText: any;
  
  constructor() {
  }

  public setData(data: any) {
    this.headingText = data.title;
    this.description = data.description;
  }

  ngOnDestroy(): void {
  }

}
