import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Constants } from '../../constants';
import { PopupService } from '../../services/popup/popup.service';
import { LoginService } from '../../services/login/login.service';
import { LoginUser } from '../../interfaces';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private _http = inject(HttpClient);
  private router = inject(Router);
  private popupService = inject(PopupService);
  private loginService = inject(LoginService);
  private dialogRef = inject(MatDialogRef<LoginComponent>);

  isLoading = false;

  selectedImage: File | null = null;

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  signupForm: FormGroup = this.fb.group({
    fullname: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    if (this.loginService.isUserLoggedIn()) {
      this.router.navigate(['']);
      return;
    }
  }

  onFileSelected(event: any) {// eslint-disable-line
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  /**
   * It either logins a user or create new account(signup).
   * @param isLoginForm flag to detect if user is login or singup/
   * @returns void.
   */
  onSubmit(isLoginForm: boolean): void {
    this.isLoading = true;
    if (isLoginForm) {
      if (this.loginForm.invalid) {
        this.popupService.showAlertMessage(Constants.INVALID_FORM_MSG, Constants.SNACKBAR_WARNING);
        this.isLoading = false;
        return;
      }
      const body = new URLSearchParams();
      body.set('username', this.loginForm.get('username')?.value);
      body.set('password', this.loginForm.get('password')?.value);
      this._http
        .post<LoginUser>(Constants.LOGIN_USER, body.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .subscribe(
          (res: LoginUser) => {
            this.loginService.loginUser(res.access_token, res.user_id);
            this.popupService.showAlertMessage(Constants.LOGIN_MSG, Constants.SNACKBAR_SUCCESS);
            this.dialogRef.close();
            this.loginService.loginSubject$.next(true);
            this.isLoading = false;
          },
          (error) => {
            this.popupService.showAlertMessage(
              error?.error?.detail || Constants.GENERIC_MSG,
              Constants.SNACKBAR_ERROR
            );
            this.isLoading = false;
          }
        );
    } else {
      if (this.signupForm.invalid) {
        this.popupService.showAlertMessage(Constants.INVALID_FORM_MSG, Constants.SNACKBAR_WARNING);
        this.isLoading = false;
        return;
      }
      if (
        this.signupForm.get('password')?.value !== this.signupForm.get('confirmPassword')?.value
      ) {
        this.popupService.showAlertMessage(
          Constants.PASSWORDS_MISMATCH_MSG,
          Constants.SNACKBAR_ERROR
        );
        this.isLoading = false;
        return;
      }
      const formData = new FormData();
      formData.append('username', this.signupForm.get('username')?.value);
      formData.append('email', this.signupForm.get('email')?.value);
      formData.append('password', this.signupForm.get('password')?.value);
      formData.append('fullname', this.signupForm.get('fullname')?.value);
      formData.append('role', 'user');
      if (this.selectedImage) {
        formData.append('image', this.selectedImage, this.selectedImage.name);
      }

      this._http.post(Constants.CREATE_USER, formData).subscribe(
        () => {
          this.popupService.showAlertMessage(
            Constants.USER_CREATED_MSG,
            Constants.SNACKBAR_SUCCESS
          );
          this.signupForm.reset();
          this.dialogRef.close();
          this.isLoading = false;
          this.router.navigate(['']);
        },
        (error) => {
          this.popupService.showAlertMessage(
            error?.error?.detail || Constants.GENERIC_MSG,
            Constants.SNACKBAR_ERROR
          );
          this.isLoading = false;
        }
      );
    }
  }
}
