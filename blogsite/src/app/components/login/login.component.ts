import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class LoginComponent {
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);

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
        } else {
            if (this.signupForm.invalid) {
                this.snackBar.open('Some fields are invalid.', 'Close', {
                    duration: 4000,
                    verticalPosition: 'top',
                    panelClass: ['snackbar-warning'],
                });
                return;
            }
        }
    }
}
