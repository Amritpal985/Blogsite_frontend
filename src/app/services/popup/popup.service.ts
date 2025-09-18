import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private snackbar = inject(MatSnackBar);

  /**
   * It opens a snackbar on the UI.
   * @param message to display on the UI.
   * @param panelClass to apply on the snackbar.
   */
  showAlertMessage(message: string, panelClass: string) {
    this.snackbar.open(message, 'Close', {
      duration: 4000,
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
