import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatComponent } from '../chat/chat.component';
import { MatButtonModule } from '@angular/material/button';
import { PopupService } from '../../services/popup/popup.service';
import { Constants } from '../../constants';
import { LoginService } from '../../services/login/login.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../interfaces';
import { HttpClient } from '@angular/common/http';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ChatComponent,
    SpinnerComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private popupService = inject(PopupService);
  private loginService = inject(LoginService);
  private _http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  user!: User;
  profileForm!: FormGroup;
  isLoading = false;

  ngOnInit() {
    this.isLoading = true;
    this.loginService.loginSubject$
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const isUserLoggedIn = this.loginService.isUserLoggedIn();
        if (!isUserLoggedIn) this.router.navigate(['']);
      });
    this.initializeUpdateForm();
    this.getUserDetails();
  }

  private getUserDetails() {
    this._http.get<User>(Constants.GET_USER_INFO).subscribe(
      (res) => {
        this.user = res;
        this.updateFormValues();
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  private initializeUpdateForm() {
    this.profileForm = this.fb.group({
      fullname: ['', Validators.required],
      username: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      newPassword: [''],
      confirmPassword: [''],
    });
  }

  private updateFormValues() {
    this.profileForm.patchValue({
      fullname: this.user.fullname,
      username: this.user.username,
      email: this.user.email,
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.popupService.showAlertMessage(Constants.INVALID_FORM_MSG, Constants.SNACKBAR_ERROR);
      return;
    }
    if (
      this.profileForm.get('newPassword')?.value !== this.profileForm.get('confirmPassword')?.value
    ) {
      this.popupService.showAlertMessage(
        Constants.PASSWORDS_MISMATCH_MSG,
        Constants.SNACKBAR_ERROR
      );
      return;
    }

    const formData = new FormData();
    formData.append('fullname', this.profileForm.get('fullname')?.value);
    const pwd = this.profileForm.get('newPassword')?.value;
    if (pwd) formData.append('password', pwd);
    this._http.put(Constants.UPDATE_USER_INFO, formData).subscribe(
      () => {
        this.popupService.showAlertMessage(Constants.USER_UPDATED_MSG, Constants.SNACKBAR_SUCCESS);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
