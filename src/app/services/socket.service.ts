import { io } from "socket.io-client";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class SocketService {

    private url = 'http://localhost:3000';
    private socket;

    constructor() {
        this.socket = io(this.url);
    }
   
    // ************************ EMITTERS ***********************************

    public sendPost(post: any) {
        this.socket.emit('new-post', post);
    }

    public sendTimelinePost(timelinepost: any) {
        this.socket.emit('new-timeline-post', timelinepost);
    }

    public sendFriendRequest(friendrequest: any) {
        this.socket.emit('add-friend', friendrequest);
    }

    public sendLikes(likes: any) {
        this.socket.emit('set-likes', likes);
    }

    public sendComments(comments: any) {
        this.socket.emit('set-comments', comments);
    }

    public sendReplies(replies: any) {
        this.socket.emit('set-replies', replies);
    }

    // ************************ LISTENERS *********************************
    public getRequest = () => {
        return new Observable(
            (observer) => {
                this.socket.on('addfriend', (friendrequest) => {
                    observer.next(friendrequest);
                });
            });
    }

    public getPost = () => {
        return new Observable(
            (observer) => {
                this.socket.on('new-post', (post) => {
                    observer.next(post);
                });
            });
    }

    public getTimelinePost = () => {
        return new Observable(
            (observer) => {
                this.socket.on('new-timeline-post', (timelinepost) => {
                    observer.next(timelinepost);
                });
            });
    }

    public getLikes = () => {
        return new Observable(
            (observer) => {
                this.socket.on('set-likes', (likes) => {
                    observer.next(likes);
                })
            }
        )
    }

    public getComments = () => {
        return new Observable(
            (observer) => {
                this.socket.on('set-comments', (comments) => {
                    observer.next(comments);
                })
            })
    }

    public getReplies = () => {
        return new Observable(
            (observer) => {
                this.socket.on('set-replies', (replies) => {
                    observer.next(replies);
                })
            }
        )
    }

} //*** Class Ends */