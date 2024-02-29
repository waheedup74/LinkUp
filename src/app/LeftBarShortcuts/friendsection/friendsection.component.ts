import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendConnector } from 'src/app/services/backendconnector.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { Friends } from 'src/app/models/friends.model';

@Component({
  selector: 'app-friendsection',
  templateUrl: './friendsection.component.html',
  styleUrls: ['./friendsection.component.css']
})
export class FriendsectionComponent implements OnInit, OnDestroy {

  friendRequestSubscription!: Subscription;
  friendSuggestionSubscription!: Subscription;

  friendSuggestions!: Friends[];
  remainingFriendSuggestions = 0;
  userId: number = 0;
  executeOnce: boolean = false;

  constructor(
    private connectorService: BackendConnector,
    private socketService: SocketService,
    public session: SessionStorageService) {

    localStorage.setItem('routerUrl', '/shortcuts/friendsection');
  }

  ngOnInit() {
    this.userId = parseInt(this.session.get('authUserId'));

    this.connectorService.loadfriendSuggestions();

    this.friendSuggestionSubscription = this.connectorService.setSuggestedFriends.subscribe(
      (friendsData: any) => {
        if (!this.executeOnce) {
          this.friendSuggestions = friendsData.friendSuggestions;
          this.executeOnce = true;
        }
        else 
          this.friendSuggestions = this.friendSuggestions.concat(friendsData.friendSuggestions);
      });

    this.friendRequestSubscription = this.socketService.getRequest().subscribe(
      (getfriendsData: any) => {
         let friendsData = getfriendsData.storedFriendRequest;
              
        for (let friend of this.friendSuggestions) {
          if (friendsData.receiver_id == friend.user_id && friendsData.sender_id == this.userId) {
            friend.request_status = 2;
          }
        }
      });
  }

  loadMoreFriends() {
    this.connectorService.getfriendSuggestions(this.friendSuggestions[this.friendSuggestions.length - 1].user_id);
  }

  sendFriendRequest(receiverId: number) {
    this.connectorService.sentFriendRequest(this.userId, receiverId, 2);
  }

  ngOnDestroy() {
    this.friendSuggestionSubscription.unsubscribe();
    this.friendRequestSubscription.unsubscribe();
  }
}
