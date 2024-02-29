import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoginStatusService } from '../../services/loginstatus.service';
import { BackendConnector } from '../../services/backendconnector.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { SessionStorageService } from 'angular-web-storage';
import { Comments } from 'src/app/models/comments.model';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit, OnDestroy {

  getPostSubscription!: Subscription;
  getProfileSubscription!: Subscription;
  getLikeSubscription!: Subscription;
  getCommentSubscription!: Subscription;
  getReplySubscription!: Subscription;

  postingFormGroup: FormGroup;

  selectedUploadFile: File | null = null;

  previousPosts = [];
  createcomments: Comments[] = [];
  filteredPosts = [];

  createpost: any;
  createreplies: any;
  usernames: any;
  profilePics: any;
  myProfilePic: any = "";
  allFriendsRequest: any = "";

  // 0- All, 1- My Posts, 2- Friends Only, 3- Page Posts Only
  @Input() showPostStatus: number = 0;
  receivedPostCount: number = 0;
  maxPostsId: number = 0;
  minPostId: number = 0;
  userId: number = 0;
  currentReplyId: number = 0;
  previousReplyId: number = 0;

  showLoadMoreButton: boolean = false;
  loadMore: boolean = false;
  commentReplyStatus: boolean = false;
  replyCommentStatus: boolean = false;
  wasMorePostLoaded: boolean = false;
  isImageUploaded: boolean = false

  imageSrc: string = "";
  commentValue: string = '';
  replyValue: string = '';

  @ViewChild('postIdField') postIdField!: ElementRef;
  
  constructor(
    private route: Router,
    private loginService: LoginStatusService,
    public session: SessionStorageService,
    private backendService: BackendConnector,
    private formbuilder: FormBuilder,
    private socketService: SocketService
    ) {

    this.postingFormGroup = this.formbuilder.group({
      'desc': ['', [Validators.required]],
    });
  }


  ngOnInit() {
    this.userId = parseInt(this.session.get('authUserId'));
    localStorage.setItem('routerUrl', '/landingpage/home');

    this.backendService.getMaxPostId().subscribe(
      (maxPostId: any) => {
        this.maxPostsId = maxPostId + 1;
        this.backendService.getPost(this.maxPostsId);
      }
    );

    this.backendService.getProfilePic(this.userId);
    this.getProfileSubscription = this.backendService.setMyProfilePic.subscribe(
      (data: any) => {
        this.myProfilePic = '/assets/pics/noProfile.png';
        if (data.profilePic != null) this.myProfilePic = data.profilePic;
      }
    )

    this.backendService.getPost(0);
    this.getPostSubscription = this.socketService.getPost().subscribe(
      (newpost: any) => {
        this.usernames = newpost.usernames;
        this.profilePics = newpost.profilepics;
        this.allFriendsRequest = newpost.allFriendRequest;

        const userPostsLength = newpost.userPostsLength;

        if (newpost.posts.length == 0) return;

        if (!this.loadMore && newpost.status == "upload") {
          if (this.allFriendsRequest.length != 0) {
            for (let post of newpost.posts) {
              for (let friend of this.allFriendsRequest) {
                if (((this.session.get('authUserId') == friend.sender_id &&
                  post.user_id == friend.receiver_id && friend.request_status == 1) ||
                  (this.session.get('authUserId') == friend.receiver_id &&
                    post.user_id == friend.sender_id && friend.request_status == 1))
                  || (this.session.get('authUserId') == post.user_id)) {

                  this.createpost = newpost.posts.concat(this.previousPosts);
                  this.previousPosts = this.createpost;

                  if (!this.wasMorePostLoaded && this.createpost.length > 5) {
                    this.createpost.splice(this.createpost.length - 1, 1);
                    this.showLoadMoreButton = true;
                  }
                  break;
                }

              }
            }
          }
          else {
            if (this.session.get('authUserId') == newpost.posts[0].user_id) {
              this.createpost = newpost.posts.concat(this.previousPosts);
              this.previousPosts = this.createpost;

              if (!this.wasMorePostLoaded && this.createpost.length > 5) {
                this.createpost.splice(this.createpost.length - 1, 1);
                this.showLoadMoreButton = true;
              }
            }
          }
        }

        if (!this.loadMore && newpost.currentUser_Id == this.session.get('authUserId') && newpost.status != "upload") {
          if (userPostsLength > 5)  this.showLoadMoreButton = true;
          this.createpost = newpost.posts;
          this.previousPosts = newpost.posts;
        }

        if (this.loadMore && newpost.currentUser_Id == this.session.get('authUserId')) {
          this.createpost = this.previousPosts.concat(newpost.posts);
          this.previousPosts = this.previousPosts.concat(newpost.posts);
          if (newpost.posts.length < 5) this.showLoadMoreButton = false;
        }

        this.backendService.getLike();
        this.backendService.getComment();
        this.backendService.getReply();
      });


    // * GET LIKES *****************************************************************************
    this.getLikeSubscription = this.socketService.getLikes().subscribe(
      (likes: any) => {
        for (let post of this.createpost) {
          for (let totalLikes of likes.postTotalLikes) {
            if (totalLikes.post_id == post.post_id) {
              post.totalLikes = totalLikes.totalLikes;
              post.totalDislikes = totalLikes.totalDislikes;
              break;
            }
          }

          for (let like of likes.likedDisliked) {
            if ((like.user_id == this.userId) && (like.post_id == post.post_id)) 
              post.liked = like.likes;

            if ((like.user_id == this.userId) && (like.post_id == post.post_id)) 
              post.disliked = like.dislikes;
          }
        }
      });

      
    // * GET COMMENTS *****************************************************************************
    this.getCommentSubscription = this.socketService.getComments().subscribe(
      (postcomments: any) => {
        this.createcomments = postcomments.comments;

        for (let post of this.createpost) {
          for (let comment of postcomments.totalComments) {
            if (comment.post_id == post.post_id) {
              post.totalComments = comment.totalComments;
              break;
            }
          }
        }

        for (let post of this.createpost) {
          for (let comment of this.createcomments) {

            if (comment.post_id == post.post_id) {
              for (let pic of this.profilePics) {
                if (pic.user_id == comment.user_id) {
                  comment.profilePic = pic.picFile;
                  break;
                }
              }

              for (let name of this.usernames) {
                if (name.user_id == comment.user_id) {
                  comment.username = name.username;
                  break;
                }
              }
            }
          }
        }
      });

    // * GET REPLIES *****************************************************************************
    this.getReplySubscription = this.socketService.getReplies().subscribe(
      (postreplies: any) => {
        this.createreplies = postreplies.replies;

        for (let post of this.createpost) {
          for (let reply of postreplies.totalReplies) {
            if (reply.post_id == post.post_id) {
              post.totalReplies = reply.totalReplies;
            }
          }
        }

        for (let post of this.createpost) {
          for (let reply of this.createreplies) {
            for (let comment of this.createcomments) {
              if (reply.post_id == post.post_id && reply.comment_id == comment.comment_id) {

                for (let pic of this.profilePics) {
                  if (pic.user_id == reply.user_id) {
                    reply.profilePic = pic.picFile; break;
                  }
                }

                for (let name of this.usernames) {
                  if (name.user_id == reply.user_id) {
                    reply.username = name.username; break;
                  }
                }
              }
            }
          }
        }
      });

  } //- *** OnInit Ends *************

  public addMyPost(desc: string) {
    this.loadMore = false;
    if(this.selectedUploadFile) this.backendService.uploadPost(this.selectedUploadFile, desc, 0);

    this.isImageUploaded = false;
    this.imageSrc = "";
    this.selectedUploadFile = null;
    this.postingFormGroup.reset();
  }

  onImageUpload(event: Event) {
    this.loadMore = false;

    if (event && event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0){
      this.selectedUploadFile = <File>event.target.files[0];
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result as string;
      reader.readAsDataURL(file);
      this.isImageUploaded = true;
    }
  }

  onPostLike(isLiked: number) {
    this.loadMore = false;
    this.backendService.setLikeDislike(!isLiked, false, this.postIdField.nativeElement.value, this.previousPosts.length);
  }

  onPostdisLike(isDisliked: number) {
    this.loadMore = false;
    this.backendService.setLikeDislike(false, !isDisliked, this.postIdField.nativeElement.value, this.previousPosts.length);
  }

  MainComment(event: Event, postId: number, textArea: HTMLTextAreaElement) {
    this.loadMore = false;
    if ((event as KeyboardEvent).code == '13') {
      this.backendService.setComment(postId, textArea.value, this.previousPosts.length);
      this.commentValue = "";
      this.commentReplyStatus = false;
      this.replyCommentStatus = false;
      textArea.placeholder = "Post your comment";
    }
  }

  ReplyComment(event: Event, postId: number, commentId: number, textArea: HTMLTextAreaElement) {
    this.loadMore = false;
    if ((event as KeyboardEvent).code == '13') {
      this.backendService.setReply(postId, commentId, textArea.value, this.previousPosts.length);
      this.replyValue = "";
      this.replyCommentStatus = false;
      this.commentReplyStatus = false;
      textArea.placeholder = "Post your comment";
    }
  }

  showCommentReply(commentId: number) {
    this.loadMore = false;
    this.replyValue = "";
    this.commentReplyStatus = !this.commentReplyStatus;

    if (this.commentReplyStatus)
      this.replyCommentStatus = false;

    if (this.previousReplyId == commentId) {
      this.currentReplyId = this.previousReplyId;
    }
    else {
      this.currentReplyId = commentId;
      this.previousReplyId = this.currentReplyId;

      if (!this.commentReplyStatus) {
        this.commentReplyStatus = true;
      }
    }
  }

  showReplyComment(userId: string, replyId: number) {
    this.loadMore = false;
    for (var name of this.usernames) {
      if (name.user_id == userId)
        this.replyValue = "@" + name.username;
    }

    this.replyCommentStatus = !this.replyCommentStatus;

    if (this.replyCommentStatus)
      this.commentReplyStatus = false;

    if (this.previousReplyId == replyId) {
      this.currentReplyId = this.previousReplyId;
    }
    else {
      this.currentReplyId = replyId;
      this.previousReplyId = this.currentReplyId;

      if (!this.replyCommentStatus) {
        this.replyCommentStatus = true;
      }
    }
  }

  setNextRoute(nextRoute: string) {
    this.loginService.setNextRouteName(nextRoute);
  }

  LoadMorePost(maxPostId: number) {
    console.log("*** Loading More Posts");
    this.wasMorePostLoaded = true;
    this.loadMore = true;
    this.backendService.getPost(maxPostId);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loginService.getNextRouteName() != "")
      return true;
    if (!this.loginService.getuserLogedinStatus())
      return true;
    else {
      this.route.navigate(['landingpage/home']);
      return false;
    }
  }

  ngOnDestroy() {
    this.getProfileSubscription.unsubscribe();
    this.getPostSubscription.unsubscribe();
    this.getCommentSubscription.unsubscribe();
    this.getReplySubscription.unsubscribe();
    this.getLikeSubscription.unsubscribe();
  }
}
