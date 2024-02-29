import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public notificationComponentRef: ComponentRef<NotificationComponent> | any;
  public containerElementViewRef: ViewContainerRef | any;
  
  public newNotification(componentType: Type<any>, popup_data: any) {
    if (this.notificationComponentRef) {
      this.closeNotification();
      this.notificationComponentRef.instance.onClose$.next(true);
    }

    this.openNotification(componentType);
    this.notificationComponentRef.instance.popupdate = popup_data;

    this.notificationComponentRef.instance.onClose$.subscribe(() =>
      this.closeNotification()
    );
  }

  private openNotification(componentType: Type<any>) {
    this.notificationComponentRef =
      this.containerElementViewRef.createComponent(NotificationComponent);

    this.notificationComponentRef.instance.childComponentType = componentType;
  }

  private closeNotification() {
    this.notificationComponentRef.destroy();
  }
}
