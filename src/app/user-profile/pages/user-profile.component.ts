import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { MatSnackBar, MatDialogActions } from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UserProfileServiceService } from '../services/user-profile-service.service';
import { faHeartBroken, faComment } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faThumbsUp, faTrashAlt, faAddressBook } from '@fortawesome/free-regular-svg-icons';
import * as moment from 'moment';
import { AuthService } from '../../shared/services/auth.service';
import { TimelineService } from '../../timeline/services/timeline.service';
import { ProfileService } from '../../profile/services/profile.service';
import { FollowService } from '../../search-engine/services/follow.service';
import { DialogFollowingComponent } from '../../profile/dialog-following/dialog-following.component';
import { DialogRepliesComponent } from '../../timeline/dialog-replies/dialog-replies.component';
import { DialogprofileComponent } from '../../profile/dialogprofile/dialogprofile.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  witObject = {};
  replyObject = {};
  @ViewChild('replyPost') replyPost: ElementRef;
  @ViewChild('witPost') witPost: ElementRef;
  userWits: any;
  userData: any;
  faHeart = faHeart;
  faTrashAlt = faTrashAlt;
  faThumbsUp = faThumbsUp;
  faComment = faComment;
  faAddressBook = faAddressBook;
  faHeartBroken = faHeartBroken;
  likesListProfile = [];
  likesOfWits: any;
  listOfFollowing: any;
  listOfFollowers: any;
  likedWits: any;
  userLoggedIN: any;
  userObj: any = {};
  user = {};
  constructor(
    private userProfileService: UserProfileServiceService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private timelineService: TimelineService,
    private profileService: ProfileService,
    private followService: FollowService,
    private router: ActivatedRoute
  ) {
    this.user = {
      'username': this.router.snapshot.params['p1']
    };
    
  }

  ngOnInit() {
    this.sendUserToken();
    this.getUserInfo(this.user);
    this.getWits(this.user);
    this.getFollowingList(this.user);
    this.getFollowerList(this.user);
    this.getlikedWits(this.user);
  }
  sendUserToken() {
    this.userProfileService.requestUserLoggedIn().subscribe(
      res => { this.userLoggedIN = res; },
      err => console.error(err));
  }

  getUserInfo(user) {
    this.userObj['username'] = user.username;
    this.userObj['token'] = localStorage.getItem('token');
    this.userProfileService.getUserInfo(this.userObj).subscribe(
      res => { this.userData = res[0];
       },
      err => { console.error(err); });      
  }

  getWits(user) {
    this.userProfileService.getWits(user).subscribe(
      res => {
        this.userWits = res;

        if (typeof this.userWits === 'string') {
          this.userWits = undefined
        }
        
        if (typeof this.userWits !== 'string' && this.userWits ) {
          this.userWits = this.userWits.reverse();
          this.userWits.forEach(element => {
            if (moment(element.time).isSame(moment(), 'day')) {
              element.time = moment(element.time).fromNow();
            } else {
              element.time = moment(element.time).format('MMMM Do YYYY');
            }
            this.getLikedList(element.wit_id);
             element.likesList = this.likesListProfile;
             console.log(this.userWits);
          });
        }
      },
      err => console.log('error', err)
    );
  }

  getLikedList(id: number): Array<any> {
    const idObj = { wit_id: id };
    this.userProfileService.getLikesList(idObj).subscribe(
      res => {
        const list2 = res;
        this.likesListProfile = [];
        for (let i = 0; i <= list2.length; i++ ) {
          if (list2[i]) {
            this.likesListProfile.push(list2[i]['username']);
          }
        }
      },
      err => {console.error(err); }
    );
    return this.likesListProfile;
  }

  getFollowingList(user) {
    this.userProfileService.getFollowingList(user).subscribe(
      res => { this.listOfFollowing = res; },
      err => {console.error(err); }
    ); }



    getFollowerList(user) {
      this.userProfileService.getFollowerList(user).subscribe(
        res => {
          this.listOfFollowers = res;
        },
        err => {console.error(err)}
      );
    }

    submitReply(value: string, wit_id: number) {
      this.replyObject['reply'] = value;
      this.replyObject['wit_id'] = wit_id;
      this.replyObject['token'] = localStorage.getItem('token');
      this.userProfileService.postReply(this.replyObject).subscribe(
        res => {
          this.replyPost.nativeElement.value = '';
          console.log(res);
          this.snackBar.open('Reply posted successfully', 'ok', {
            duration: 3000
          });
        },
        err => {
          this.snackBar.open('Error posting Reply', 'ok', {
            duration: 3000
          });
          console.error(err);
        }
      );
    }

    likePost(id: number) {
      const likeObj = { wit_id: id };
      this.timelineService.likeWit(likeObj).subscribe(
        res => {
          this.snackBar.open('Wit liked successfully', 'ok', {
            duration: 3000
          });
          this.getWits(this.user);
        },
        err => {
          this.snackBar.open('Error liking wit', 'ok', {
            duration: 3000
          });
          console.error(err);
        }
      );
    }
    unLikePost(id: number) {
      const unLikeObj = { wit_id: id };
      console.log('hello I am here: ' + unLikeObj.wit_id);
      this.timelineService.unlikeWit(unLikeObj).subscribe(
        res => {
          this.snackBar.open('Wit unliked successfully', 'ok', {
            duration: 3000
          });
          this.getWits(this.user);
        },
        err => {
          this.snackBar.open('Error unliking wit', 'ok', {
            duration: 3000
          });
          console.error(err);
        }
      );
    }
    getlikedWits(user) {

      this.userProfileService.getlikedWits(user).subscribe(
        res => {
          this.likedWits = res;
          if (this.likedWits) {
            this.likedWits = this.likedWits.reverse();
            this.likedWits.forEach(element => {
              if (moment(element.time).isSame(moment(), 'day')) {
                element.time = moment(element.time).fromNow();
              } else {
                element.time = moment(element.time).format('MMMM Do YYYY');
              }
              this.getLikedList(element.wit_id);
               element.likesList = this.likesListProfile;
            });
          }
        },
        err => console.error(err)
      );
    }
    likePostLikeSection(id: number) {
      const likeObj = { wit_id: id };
      this.timelineService.likeWit(likeObj).subscribe(
        res => {
          this.snackBar.open('Wit liked successfully', 'ok', {
            duration: 3000
          });
          this.getlikedWits(this.user);
        },
        err => {
          this.snackBar.open('Error liking wit', 'ok', {
            duration: 3000
          });
          console.error(err);
        }
      );
    }
    unLikePostLikeSection(id: number) {
      const unLikeObj = { wit_id: id };
      console.log('hello I am here: ' + unLikeObj.wit_id);
      this.timelineService.unlikeWit(unLikeObj).subscribe(
        res => {
          this.snackBar.open('Wit unliked successfully', 'ok', {
            duration: 3000
          });
          this.getlikedWits(this.user);
        },
        err => {
          this.snackBar.open('Error unliking wit', 'ok', {
            duration: 3000
          });
          console.error(err);
        }
      );
    }
    checkIfUserLikedLikeSection(wit: any) {
      if (wit.boolValue === 0) {
        this.likePostLikeSection(wit.wit_id);
      } else if (wit.boolValue === 1 && wit.numOfLikes !== 0) {
        this.unLikePostLikeSection(wit.wit_id);
      }
    }
    checkIfUserLiked(wit: any) {
      if (wit.boolValue === 0) {
        this.likePost(wit.wit_id);
      } else if (wit.boolValue === 1 && wit.numOfLikes !== 0) {
        this.unLikePost(wit.wit_id);
      }
    }



    openDialogReplies(wit: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '60%';
      dialogConfig.data = {
        wit_id: wit
       };
       this.dialog.open(DialogRepliesComponent, dialogConfig);
    }

    openDialogFollowing(following: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '30%';
      dialogConfig.data = {
        follow: following
      };
      this.dialog.open(DialogFollowingComponent, dialogConfig);
    }
    openDialogLikes(wit: any) {
      this.likesOfWits = wit;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '30%';
      dialogConfig.data = {
        wit_id: wit.wit_id
       };
      this.dialog.open(DialogprofileComponent, dialogConfig);
    }

    getUser() {
      this.auth.requestUserData().subscribe(
        res => {
          this.userLoggedIN = res;
        },
        err => console.error(err)
      );
    }

    followUser(username) {      
      const obj = { 'userLoggedIN': this.userLoggedIN, 'username': username }
      this.followService.followUser(obj).subscribe(
        res => {
          console.log(res);
          this.getUserInfo(obj);
        },
        err => {
          console.error(err);
        }
      );
    }

}
