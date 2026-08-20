import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastData {
  message: string;
  type: ToastType;
}

@Component({
  selector: 'app-toast',
  imports: [MatIconModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly snackRef = inject(MatSnackBarRef<ToastComponent>);
  readonly data = inject<ToastData>(MAT_SNACK_BAR_DATA);

  readonly icons: Record<ToastType, string> = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
  };
}
