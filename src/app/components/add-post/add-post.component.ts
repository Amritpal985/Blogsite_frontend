import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgxEditorModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss',
})
export class AddPostComponent implements OnInit, OnDestroy {
  editor!: Editor;
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  form!: FormGroup;

  ngOnInit(): void {
    this.editor = new Editor();
    this.form = this.fb.group({
      title: [''],
      content: [''],
      tags: [[]],
    });
  }

  hasUnsavedChanges() {
    const { title, content, tags } = this.form.value;
    return !!(title?.trim() || content?.trim() || tags?.length);
  }

  async openPageLeavingConfirmation() {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      data: {
        title: 'Unsaved Changes.',
        message: 'Are you sure you want to leave?',
      },
    });
    return await lastValueFrom(dialogRef.afterClosed());
  }

  savePost() {
    console.log(this.form.value);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
