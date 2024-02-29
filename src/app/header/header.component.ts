import { BackendConnector } from './../services/backendconnector.service';
import { Component, OnInit } from '@angular/core';
import { LoginStatusService } from '../services/loginstatus.service';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { SessionStorageService } from 'angular-web-storage';
import { Friends } from '../models/friends.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  getProfileSubscription!: Subscription;
  addFriendSubscription!: Subscription;
  setFriendsSubscription!: Subscription;

  allUserdata: any;
  myProfilePic: any = '/assets/pics/noProfile.png';

  friendRequests!: Friends[];
  friendSuggestions!: Friends[];

  isUserLoggedIn: boolean = false;
  friendSuggestionLimit: number = 2;
  userId: number = 0;
  friendRequestCount: number = 0;
  remainingFriendSuggestions = 0;

  constructor(
    private connectorService: BackendConnector,
    private loginService: LoginStatusService,
    public session: SessionStorageService,
    private socketService: SocketService
    ) {}

  ngOnInit() {
    this.userId = parseInt(this.session.get('authUserId'));

    this.loginService.userLoginStatus.subscribe(
      (userLoginStatus: boolean) => {
        this.isUserLoggedIn = userLoginStatus;
      }
    );

    // SUBSCRIBERS --------------------------------------------------------------------------
    this.connectorService.getProfilePic(this.userId);

    this.getProfileSubscription = this.connectorService.setMyProfilePic.subscribe(
      (data: any) => {
        if (data.profilePic != null) {
          this.myProfilePic = data.profilePic;
        }
      }
    )

    if (this.session.get('authUserId') != null)
      this.connectorService.getFriendsData();

    this.setFriendsSubscription = this.connectorService.setFriends.subscribe(
      (friendsData: any) => {
        this.friendRequestCount = friendsData.receivedFriendRequestsCount;
        this.friendRequests = friendsData.receivedFriendRequests;
        this.friendSuggestions = friendsData.friendSuggestions;
        this.remainingFriendSuggestions = friendsData.remainingFriendsSuggestions;
      });

    this.addFriendSubscription = this.socketService.getRequest().subscribe(
      (getfriendsData: any) => {
        let friendsData = getfriendsData.storedFriendRequest;
        let requestUpdated = getfriendsData.requestUpdated;
        let index = 0;
        let selectedIndex = 0;

        if (requestUpdated == 0) {
          for (let friend of this.friendSuggestions) {
            if (this.userId == friendsData.receiver_id) {
              if (friendsData.sender_id == friend.user_id) {
                this.friendSuggestions.splice(index, 1);
                this.friendRequests.push(friend);
                this.friendRequestCount++
              }
            }
            index++;
          }
        }

        index = 0;
        for (let friend of this.friendRequests) {
          if (friendsData.receiver_id == friend.receiver_id && friendsData.sender_id == friend.sender_id) {
            if (friendsData.request_status == 1) {
              friend.request_status = 1;
              selectedIndex = index;
              this.friendRequests.splice(selectedIndex, 1);
            }
            else {
              friend.request_status = 0;
              selectedIndex = index;
              this.friendRequests.splice(selectedIndex, 1);
            }
          }
          index++;
        }

        for (let friend of this.friendSuggestions) {
          if (friendsData.receiver_id == friend.user_id && friendsData.sender_id == this.userId) {
            friend.request_status = 2;
          }
        }

      });

    //--------------------------------------------------------------------------------------
  }

  openCreatePage(nextRoute: string) {
    this.loginService.setNextRouteName(nextRoute);
  }

  sendFriendRequest(receiverId: number) {
    this.connectorService.sentFriendRequest(this.userId, receiverId, 2);
  }

  acceptFriendRequest(senderId: number, receiver: number) {
    this.connectorService.FriendRequestUpdate(senderId, receiver, 1);
  }

  rejectFriendRequest(senderId: number, receiver: number) {
    this.connectorService.FriendRequestUpdate(senderId, receiver, 0);
  }

  setRoute(nextRoute: string) {
    this.loginService.setNextRouteName(nextRoute);
  }

  signOut(){
    this.isUserLoggedIn = false;
    this.loginService.signOut();
  }
  
  resetVariables() {
    this.myProfilePic = "";
    this.allUserdata = [];
    this.friendRequests = [];
    this.friendSuggestions = [];
  }

  ngOnDestroy() {
    this.addFriendSubscription.unsubscribe();
    this.setFriendsSubscription.unsubscribe();
    this.getProfileSubscription.unsubscribe();
  }
}
