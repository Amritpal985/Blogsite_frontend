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
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private popupService = inject(PopupService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  profileForm!: FormGroup;

  ngOnInit() {
    this.loginService.loginSubject$
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const isUserLoggedIn = this.loginService.isUserLoggedIn();
        if (!isUserLoggedIn) this.router.navigate(['']);
      });
    this.initializeUpdateForm();
  }

  private initializeUpdateForm() {
    this.profileForm = this.fb.group({
      name: ['Nishant', Validators.required],
      username: [{ value: 'nishant', disabled: true }, Validators.required],
      email: [{ value: 'nk@gmail.com', disabled: true }, Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
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
    const body = this.profileForm.value;
    console.log(body);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
