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

  /**
   * It either logins a user or create new account(signup).
   * @param isLoginForm flag to detect if user is login or singup/
   * @returns void.
   */
  onSubmit(isLoginForm: boolean): void {
    if (isLoginForm) {
      if (this.loginForm.invalid) {
        this.popupService.showAlertMessage(Constants.INVALID_FORM_MSG, Constants.SNACKBAR_WARNING);
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
            this.loginService.loginUser(res.access_token);
            this.popupService.showAlertMessage(Constants.LOGIN_MSG, Constants.SNACKBAR_SUCCESS);
            this.dialogRef.close();
            this.loginService.loginSubject$.next(true);
          },
          (error) => {
            this.popupService.showAlertMessage(
              error?.error?.detail || Constants.GENERIC_MSG,
              Constants.SNACKBAR_ERROR
            );
          }
        );
    } else {
      if (this.signupForm.invalid) {
        this.popupService.showAlertMessage(Constants.INVALID_FORM_MSG, Constants.SNACKBAR_WARNING);
        return;
      }
      if (
        this.signupForm.get('password')?.value !== this.signupForm.get('confirmPassword')?.value
      ) {
        this.popupService.showAlertMessage(
          Constants.PASSWORDS_MISMATCH_MSG,
          Constants.SNACKBAR_ERROR
        );
        return;
      }
      const body = { ...this.signupForm.value, role: 'user' };

      this._http.post(Constants.CREATE_USER, body).subscribe(
        () => {
          this.popupService.showAlertMessage(
            Constants.USER_CREATED_MSG,
            Constants.SNACKBAR_SUCCESS
          );
        },
        (error) => {
          this.popupService.showAlertMessage(
            error?.error?.detail || Constants.GENERIC_MSG,
            Constants.SNACKBAR_ERROR
          );
        }
      );
    }
  }
}
