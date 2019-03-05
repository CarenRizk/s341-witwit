import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLikesComponent } from './dialog-likes.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule} from '@angular/material';
import {MatDialogModule, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
describe('DialogLikesComponent', () => {
  let component: DialogLikesComponent;
  let fixture: ComponentFixture<DialogLikesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogLikesComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      imports:[BrowserModule,//was CommonModule
        ReactiveFormsModule, //was FormsModule
        FormsModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        BrowserAnimationsModule, // required animations module
        RouterTestingModule,
      HttpClientModule,
        ToastrModule.forRoot({
          timeOut: 3000,
          easeTime: 300,
          positionClass: 'toast-bottom-center',
          preventDuplicates: true,
            }),
          MatSnackBarModule,
        MatDialogModule],
        providers: [
          {provide: MatDialogRef, useValue: {}},{ provide: MAT_DIALOG_DATA, useValue: {} }
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
