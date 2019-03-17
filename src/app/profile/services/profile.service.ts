import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profileURL = 'http://localhost:3002/routes/profile/profile';
  private likedListURL = 'http://localhost:3002/routes/timeline/likesList';
  private deleteWitURL = 'http://localhost:3002/routes/profile/deleteWit';
  private listFollowingURL = 'http://localhost:3002/routes/profile/getListFollowing';
  private listFollowingOfFollowingURL = 'http://localhost:3002/routes/profile//getListFollowingOfFollowing';
  private editProfileURL = 'http://localhost:3002/routes/login_register/editProfile';
  private resetPaswordURL = 'http://localhost:3002/routes/login_register/resetPasword';
<<<<<<< Updated upstream
=======
  private likedWitsURL = 'http://localhost:3002/routes/profile/likedWits';
  private followerListURL = 'http://localhost:3002/routes/profile/getListFollowers';
  private userTokenURL = ' http://localhost:3002/routes/profile/User';
  private changedProfileURL = 'http://localhost:3002/routes/profile/changedProfile';
>>>>>>> Stashed changes

  constructor(private http: HttpClient) { }
  getFollowingOfFollowing(following){
    return this.http.post<any>(this.listFollowingOfFollowingURL, following)
  }
  getFollowingList(){
    var token = {token: localStorage.getItem('token')};
    return this.http.post<any>(this.listFollowingURL,token);
  }
  requestUserWits (){
    var token = {token: localStorage.getItem('token')};
    return this.http.post<any>(this.profileURL,token);
  }

  // Get the information from the user (http.get) add this later
  // Get the liked/ unliked information (http.get) add this later

  getLikesList (id: Object) {
    return this.http.post<any>(this.likedListURL, id);
  }

  deleteWit(id){
    return this.http.post<any>(this.deleteWitURL, id);
  }

  // user is an object that contains the member variables username, age, email
  editProfile (user){
    return this.http.post<any>(this.editProfileURL, user);
  }

  resetPassword (user){
    return this.http.post<any>(this.resetPaswordURL, user);
  }
<<<<<<< Updated upstream
=======
  getUserToken() {
    // console.log("token: " + token);
    let token = {token: localStorage.getItem('token')};
    console.log("token: " + token.token);
    return this.http.post<any>(this.userTokenURL, token);
  }
>>>>>>> Stashed changes

  getChangedProfile (){
  var token = {token: localStorage.getItem('token')};
  console.log("tokennz: " + token.token);
  return this.http.post<any>(this.changedProfileURL, token);
  }

}
