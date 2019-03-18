import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // Register and Login URLs:
  private registerUrl = 'http://localhost:3002/routes/main_pages/login_register/register';
  private loginUrl = 'http://localhost:3002/routes/main_pages/login_register/login';
  private emailUrl = 'http://localhost:3002/routes/main_pages/login_register/forgot';
  private userTokenURL = 'http://localhost:3002/routes/main_pages/timeline/timelineProfile';
  private followingListURL = 'http://localhost:3002/routes/follow/followingList';


  constructor(private http: HttpClient, private _router: Router) {
  }

  getFollowingList() {
    return this.http.get<any>(this.followingListURL);
  }

  requestUserData () {
    const token = {token: localStorage.getItem('token')};
    return this.http.post<any>(this.userTokenURL, token);
  }

  registerUser(user) {
    return this.http.post<any>(this.registerUrl, user);
  }

  loginUser(user) {
    return this.http.post<any>(this.loginUrl, user);
  }

  requestPassword(user) {
    return this.http.post<any>(this.emailUrl, user);
  }

  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

}
