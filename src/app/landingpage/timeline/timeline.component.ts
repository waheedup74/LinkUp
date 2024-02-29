import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendConnector } from 'src/app/services/backendconnector.service';
import { Subscription } from 'rxjs';
import { SessionStorageService } from 'angular-web-storage';
import { Friends } from 'src/app/models/friends.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, OnDestroy {

  unfriendSubscription!: Subscription;
  myFriendsSubscription!: Subscription;
  getProfileSubscription!: Subscription;

  selectedUploadFile: File | null = null;

  myFriends!: Friends[];
  profilePics = [];

  myProfilePic: any = '';
  usernames: any;

  rightPanelNo: number = 1;
  userId: number = 0;
  showPostStatus: number = 1; // 0- All, 1- My Posts, 2- Friends Only, 3- Page Posts Only

  isImageUploaded: boolean = false;

  activatedTab: string = 'timeline';
  imageSrc: string = "";
  commentValue: string = '';
  replyValue: string = '';

  constructor(
    public session: SessionStorageService,
    private backendService: BackendConnector
  ) { }


  ngOnInit() {
    this.userId = parseInt(this.session.get('authUserId'));

    this.backendService.getMyFriends();
    this.myFriendsSubscription = this.backendService.setMyFriends.subscribe(
      (friendsData: any) => {
        this.myFriends = friendsData;
      });

    this.unfriendSubscription = this.backendService.unfriend.subscribe(
      (unfriends: any) => {
        let index = 0;
        let selectedIndex = 0;

        for (let friend of this.myFriends) {
          if (unfriends.receiver_id == friend.receiver_id && unfriends.sender_id == friend.sender_id) {
            if (unfriends.request_status == 0) {
              friend.request_status = 0;
              selectedIndex = index;
              this.myFriends.splice(selectedIndex, 1);
            }
            index++;
          }
        }
      });

    this.backendService.getProfilePic(this.userId);
    //set user profile pic in the header
    this.getProfileSubscription = this.backendService.setMyProfilePic.subscribe(
      (data: any) => {

        this.myProfilePic = '/assets/pics/noProfile.png';
        if (data.profilePic != null) {
          this.myProfilePic = data.profilePic;
        }
      }
    )
  }


  onImageUpload(event: Event) {
    if (event && event.target && event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      this.selectedUploadFile = <File>event.target.files[0];
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result as string;
      reader.readAsDataURL(file);
      this.isImageUploaded = true;
    }
  }

  onProfilePicUpload(event: Event) {
    if (event && event.target && event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      const profileUploadedFile = <File>event.target.files[0];
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => reader.result as string;
      reader.readAsDataURL(file);
      this.backendService.uploadProfilePic(profileUploadedFile);
    }

  }

  activateSelectedTab(tabname: string) {
    this.activatedTab = tabname;
  }

  unfriend(senderId: number, receiverId: number) {
    this.backendService.unFriendRequest(senderId, receiverId);
  }

  ngOnDestroy() {
    this.getProfileSubscription.unsubscribe();
    this.myFriendsSubscription.unsubscribe();
    this.unfriendSubscription.unsubscribe();
  }
}
