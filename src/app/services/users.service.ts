import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient) { }

  whatItSay(message: string): string {
    return message;
  }

  getUsers(userId: number): Observable<any> {
    return this.http.get(`https://dummyjson.com/users/${userId}`);
  }
}
