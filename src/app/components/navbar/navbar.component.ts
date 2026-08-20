import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { LoginComponent } from '../login/login.component';
import { PopupService } from '../../services/popup/popup.service';
import { Constants } from '../../constants';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    MatDialogModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  private loginService = inject(LoginService);
  private dialog = inject(MatDialog);
  private popupService = inject(PopupService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  isLoggedIn = false;

  ngOnInit(): void {
    this.loginService.loginSubject$
      .asObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isLoggedIn = this.loginService.isUserLoggedIn();
        this.cdr.markForCheck();
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
}
