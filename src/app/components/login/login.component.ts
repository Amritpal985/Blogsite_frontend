import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

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
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private _http = inject(HttpClient);
  private router = inject(Router);

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

  onSubmit(isLoginForm: boolean) {
    if (isLoginForm) {
      if (this.loginForm.invalid) {
        this.snackBar.open('Some fields are invalid.', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['snackbar-warning'],
        });
        return;
      }
      const url = 'http://localhost:8000/users/login';
      const body = new URLSearchParams();
      body.set('username', this.loginForm.get('username')?.value);
      body.set('password', this.loginForm.get('password')?.value);
      this._http
        .post(url, body.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .subscribe(
          () => {
            this.snackBar.open('User LoggedIn Successfully!!', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
            this.router.navigate(['']);
          },
          (error) => {
            this.snackBar.open(error?.error?.detail || 'Something went wrong!!!', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            });
          }
        );
    } else {
      if (this.signupForm.invalid) {
        this.snackBar.open('Some fields are invalid.', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['snackbar-warning'],
        });
        return;
      }
      if (
        this.signupForm.get('password')?.value !== this.signupForm.get('confirmPassword')?.value
      ) {
        this.snackBar.open('Passwords do not match.', 'Close', {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
        return;
      }
      const url = 'http://localhost:8000/users/signup';
      const body = { ...this.signupForm.value, role: 'user' };

      this._http.post(url, body).subscribe(
        () => {
          this.snackBar.open('User created Successfully!!', 'Close', {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['snackbar-success'],
          });
        },
        (error) => {
          this.snackBar.open(error?.error?.detail || 'Something went wrong!!!', 'Close', {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
        }
      );
    }
  }
}
