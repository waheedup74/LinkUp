import { SocketService } from './socket.service';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from 'rxjs';
import { SessionStorageService } from 'angular-web-storage';
import { BasicResponse } from '../models/basic-response.model';

@Injectable()
export class BackendConnector {

    private baseUrl: string = "http://localhost:8000/api";
    getMypageSub = new Subject<any>();
    setMyProfilePic = new Subject<any>();
    setFriends = new Subject<any>();
    setMyFriends = new Subject<any>();
    setSuggestedFriends = new Subject<any>();
    unfriend = new Subject<any>();

    // CONSTRUCTOR -------------------------------------------------------------
    constructor(
        private http: HttpClient,
        private session: SessionStorageService,
        private socketService: SocketService) { }
    //--------------------------------------------------------------------------

    //*************************************************************************************/
    //**************************** Registration ***********************************************/
    //*************************************************************************************/
    signUpRequest(signupData: any): Observable<BasicResponse> {
        return this.http.post<BasicResponse>(this.baseUrl + "/signup", signupData);
    }

    signInRequest(signinData: any): Observable<BasicResponse> {
        return this.http.post<BasicResponse>(this.baseUrl + "/signin", signinData);
    }

    //*************************************************************************************/
    //**************************** User's Posts ***********************************************/
    //*************************************************************************************/
    public uploadPost(imageFile: File, description: string, maxPostId: number) {
        const fd = new FormData();
        const id = this.session.get('authUserId');
        let desc = "";

        if (description != "" || description != null)
            desc = description;

        fd.append('userId', id);

        if (imageFile != null)
            fd.append('image', imageFile, imageFile.name);

        fd.append('description', desc);
        fd.append('maxPostId', (maxPostId + ''));
        fd.append("status", 'uploadpost');

        return this.http.post(this.baseUrl + "/uploadpost", fd).subscribe(
            (response: any) => {
                this.socketService.sendPost(response);
            }
        );
    }

    public uploadTimelinePost(imageFile: File, description: string, maxPostId: number) {
        const fd = new FormData();
        const id = this.session.get('authUserId');
        let desc = "";

        if (description != "" || description != null)
            desc = description;

        fd.append('userId', id);

        if (imageFile != null)
            fd.append('image', imageFile, imageFile.name);
        else
            fd.append('image', imageFile, "");

        fd.append('description', desc);
        fd.append('maxPostId', (maxPostId + ''));
        fd.append("status", 'uploadpost');

        return this.http.post(this.baseUrl + "/uploadpost", fd).subscribe(
            (response: any) => {
                this.socketService.sendTimelinePost(response);
            }
        );
    }

    public getPost(maxPostId: number) {
        const data = {
            'userId': this.session.get('authUserId'),
            'maxPostId': maxPostId,
            'status': "LoadMorePosts"
        }

        this.http.post(this.baseUrl + "/retrievehomepost", data).subscribe(
            (response: any) => {
                this.socketService.sendPost(response);
            }
        );
    }

    public getTimelinePost(maxPostId: number) {
        const data = {
            'userId': this.session.get('authUserId'),
            'maxPostId': maxPostId,
            'status': "timelinepost"
        };

        return this.http.post(this.baseUrl + "/retrievetimelinepost", data).subscribe(
            (response: any) => {
                this.socketService.sendTimelinePost(response);
            }
        );
    }

    public getMaxPostId(): Observable<BasicResponse> {
        return this.http.get<BasicResponse>(this.baseUrl + "/maxpostid");
    }

    public getCurrentUserMaxPostId() {
        const data = { 'userId': this.session.get('authUserId') };

        this.http.post(this.baseUrl + "/getusermaxpostid", data).subscribe(
            (response: any) => {
                return response;
            }
        );

    }

    //*************************************************************************************/
    //**************************** User's Profile *******************************************/
    //*************************************************************************************/

    public uploadProfilePic(imageFile: File) {
        const userid = this.session.get('authUserId');
        const fd = new FormData();

        fd.append('userId', userid);

        if (imageFile != null)
            fd.append('profilePic', imageFile, imageFile.name);
        else
            fd.append('profilePic', imageFile, "");

        return this.http.post(this.baseUrl + "/uploadprofilepic", fd).subscribe(
            (response: any) => {
                this.setMyProfilePic.next(response);
            }
        );
    }

    public getProfilePic(userId: number) {
        const data = { 'userId': this.session.get('authUserId') };
        return this.http.post(this.baseUrl + "/getprofilepic", data).subscribe(
            (response: any) => {
                this.setMyProfilePic.next(response);
            }
        );
    }

    //*************************************************************************************/
    //**************************** Post Like / Dislike****************************************/
    //*************************************************************************************/

    public setLikeDislike(isLiked: boolean, isDisliked: boolean, postId: number, maxPostId: number) {
        const postLikeData = {
            'userId': this.session.get('authUserId'),
            'postId': postId,
            'isLiked': isLiked,
            'isDisliked': isDisliked,
            'maxPostId': maxPostId,
            'status': "likes"
        }

        return this.http.post(this.baseUrl + "/setlike", postLikeData).subscribe(
            (response: any) => {
                this.socketService.sendLikes(response);
            }
        );
    }

    public getLike() {
        return this.http.get(this.baseUrl + "/getlike").subscribe(
            (response: any) => {
                this.socketService.sendLikes(response);
            }
        );
    }

    //*************************************************************************************/
    //**************************** Post's Comments ******************************************/
    //*************************************************************************************/
    public setComment(postId: number, comment: string, maxPostId: number) {
        const commentData = {
            'userId': this.session.get('authUserId'),
            'postId': postId,
            'comment': comment,
            'maxPostId': maxPostId,
            'status': "comment"
        }

        return this.http.post(this.baseUrl + "/setcomment", commentData).subscribe(
            (response: any) => {
                this.socketService.sendComments(response);
            }
        );
    }

    public getComment() {
        return this.http.get(this.baseUrl + "/getcomment").subscribe(
            (response: any) => {
                this.socketService.sendComments(response);
            }
        );
    }

    public setReply(postId: number, commentId: number, commentReply: string, maxPostId: number) {
        const replyData = {
            'userId': this.session.get('authUserId'),
            'postId': postId,
            'commentId': commentId,
            'commentReply': commentReply,
            'maxPostId': maxPostId,
            'status': "reply"
        }

        return this.http.post(this.baseUrl + "/setreply", replyData).subscribe(
            (response: any) => {
                this.socketService.sendReplies(response);
            }
        );
    }

    public getReply() {
        return this.http.get(this.baseUrl + "/getreply").subscribe(
            (response: any) => {
                this.socketService.sendReplies(response);
            }
        );
    }

    // ******************************************************************************************
    // *************************** Friend's Request ************************************************
    // *****************************************************************************************
    public sentFriendRequest(senderId: number, receiverId: number, requestStatus: number) {
        const friendRequestData = {
            'receiverId': receiverId,
            'senderId': senderId,
            'requestStatus': requestStatus
        }

        return this.http.post(this.baseUrl + "/friendrequest", friendRequestData).subscribe(
            (response: any) => {
                this.socketService.sendFriendRequest(response);
            }
        );
    }

    public FriendRequestUpdate(senderId: number, receiverId: number, requestStatus: number) {
        const friendRequestData = {
            'userId': this.session.get('authUserId'),
            'senderId': senderId,
            'receiverId': receiverId,
            'requestStatus': requestStatus
        }

        return this.http.post(this.baseUrl + "/friendrequest", friendRequestData).subscribe(
            (response: any) => {
                this.socketService.sendFriendRequest(response);
            }
        );
    }

    public unFriendRequest(senderId: number, receiverId: number) {
        const unfriendRequestData = {
            'userId': this.session.get('authUserId'),
            'senderId': senderId,
            'receiverId': receiverId,
            'requestStatus': 0
        }

        return this.http.post(this.baseUrl + "/unfriendrequest", unfriendRequestData).subscribe(
            (response: any) => {
                this.unfriend.next(response);
            }
        );
    }

    public loadfriendSuggestions() {
        const data = { 'userId': this.session.get('authUserId') };

        return this.http.post(this.baseUrl + "/getfriendsdata", data).subscribe(
            (response: any) => {
                this.setSuggestedFriends.next(response);
            }
        );
    }

    public getfriendSuggestions(friendMaxUserId: number) {
        const friendSuggestData = {
            'userId': this.session.get('authUserId'),
            'friendMaxUserId': friendMaxUserId
        }

        return this.http.post(this.baseUrl + "/suggestedfriends", friendSuggestData).subscribe(
            (response: any) => {
                this.setSuggestedFriends.next(response);
            }
        )
    }

    public getFriendsData() {
        const data = { 'userId': this.session.get('authUserId') };

        return this.http.post(this.baseUrl + "/getfriendsdata", data).subscribe(
            (response: any) => {
                this.setFriends.next(response);
            }
        );
    }

    public getMyFriends() {
        const data = { 'userId': this.session.get('authUserId') };

        return this.http.post(this.baseUrl + "/getmyfriends", data).subscribe(
            (response: any) => {
                this.setMyFriends.next(response);
            }
        );
    }

    // ******************************************************************************************
    // ****************************** User's Page ************************************************
    // *****************************************************************************************
    public getSinglePage(pageId: number) {
        return this.http.post(this.baseUrl + '/mysinglepage', { 'userId': this.session.get('authUserId'), 'pageId': pageId });
    }

    public getMypage() {
        return this.http.post(this.baseUrl + '/mypage', { 'userId': this.session.get('authUserId') }).subscribe(
            (response: any) => {
                this.getMypageSub.next([response]);
            }
        );
    }

    public setCreatePage(createPageData: any, picFile: any) {
        const uploadData = new FormData();
        uploadData.append('pagename', createPageData.pagename);
        uploadData.append('pageurl', createPageData.pageurl);
        uploadData.append('pagecat', createPageData.pagecat);
        uploadData.append('pagedesc', createPageData.pagedesc);

        if (picFile != null)
            uploadData.append('image', picFile, picFile.name);
        else
            uploadData.append('image', "");

        uploadData.append('userId', this.session.get("authUserId"));


        return this.http.post(this.baseUrl + '/create-page', uploadData).subscribe((response: any) => {
            return response;
        });
    }

}