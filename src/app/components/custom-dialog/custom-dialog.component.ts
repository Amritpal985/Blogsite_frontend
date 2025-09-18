import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-custom-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './custom-dialog.component.html',
  styleUrl: './custom-dialog.component.scss',
})
export class CustomDialogComponent {
  private dialogRef = inject(MatDialogRef<CustomDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  close(value: boolean) {
    this.dialogRef.close(value);
  }
}
