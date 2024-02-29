import { Component, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  public childComponentType: Type<any> | any;
  public onClose$: Subject<boolean> = new Subject();
  private componentRef: any;
  public popupdate: any;

  @ViewChild('notificationTemplate', { read: ViewContainerRef, static: true })
  public notificationTemplate: ViewContainerRef | undefined;

  //------ Take until destroy (no need for ngDestroy) ------------
  constructor() { }

  ngOnInit(): void {
    if (this.notificationTemplate) {
      this.componentRef = this.notificationTemplate.createComponent(this.childComponentType);
      this.componentRef.instance.setData(this.popupdate);
    }
  }

  ngOnDestroy(): void {
  }

  getPopupInstance(){
    return this.componentRef;
  }

  onClose() {
    this.onClose$.next(true);
  }

}
