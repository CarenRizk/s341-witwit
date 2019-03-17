import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from '../timeline/timeline.module';
import { ProfileComponent } from './pages/profile.component';
import { MaterialModule } from '../shared/modules/material-module.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogprofileComponent } from './dialogs/dialogprofile/dialogprofile.component';
import { DialogFollowingComponent } from './dialogs/dialog-following/dialog-following.component';
import { EditprofileDialogComponent } from './dialogs/editprofile-dialog/editprofile-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { PasswordDialogComponent } from './dialogs/password-dialog/password-dialog.component';
import { DialogRepliesComponent } from '../timeline/dialogs/dialog-replies/dialog-replies.component';



@NgModule({
  declarations: [
    ProfileComponent,
    DialogprofileComponent,
    DialogFollowingComponent,
    EditprofileDialogComponent,
    PasswordDialogComponent,
  ],
  imports: [
    CommonModule,
    TimelineModule, // why is this here? What's the purpose of this?
    MaterialModule,
    MatDialogModule,
    BrowserModule,//was CommonModule
    ReactiveFormsModule, //was FormsModule
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    BrowserAnimationsModule, // required animations module
  ],
  exports: [
    ProfileComponent,
    MatDialogModule

  ],

  entryComponents: [
    DialogprofileComponent,
    DialogFollowingComponent,
    EditprofileDialogComponent,
    DialogRepliesComponent 
  ]
})
export class ProfileModule { }
