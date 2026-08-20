import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent, ToastType } from '../../components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private snackbar = inject(MatSnackBar);

  /**
   * It opens a themed toast on the UI.
   * @param message to display on the UI.
   * @param panelClass legacy type hint ('snackbar-success' | '-error' | '-warning').
   */
  showAlertMessage(message: string, panelClass: string) {
    const type: ToastType = panelClass.includes('success')
      ? 'success'
      : panelClass.includes('error')
        ? 'error'
        : 'warning';

    this.snackbar.openFromComponent(ToastComponent, {
      data: { message, type },
      duration: 4000,
      verticalPosition: 'top',
      panelClass: ['app-toast-panel'],
    });
  }
}
