import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from '../../services/login/login.service';
import { LoginComponent } from '../login/login.component';
import { PopupService } from '../../services/popup/popup.service';
import { Constants } from '../../constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, RouterModule, MatDialogModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private loginService = inject(LoginService);
  private dialog = inject(MatDialog);
  private popupService = inject(PopupService);
  private router = inject(Router);

  isLoggedIn = false;

  ngOnInit(): void {
    this.loginService.loginSubject$
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isLoggedIn = this.loginService.isUserLoggedIn();
      });
  }

  /**
   * It opens dialog for login/signup user.
   */
  openDialog() {
    this.dialog.open(LoginComponent, {
      panelClass: 'login-dialog-panel',
      backdropClass: 'login-dialog-backdrop',
    });
  }

  /**
   * Redirects to user profile page.
   */
  seeProfile() {
    this.router.navigate(['/user-profile']);
  }

  /**
   * It logout the user.
   */
  logout() {
    this.loginService.logoutUser();
    this.popupService.showAlertMessage(Constants.LOGOUT_MSG, Constants.SNACKBAR_SUCCESS);
  }

  /**
   * Cleans up any pending subscriptions.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
