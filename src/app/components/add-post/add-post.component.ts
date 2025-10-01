import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';
import { lastValueFrom } from 'rxjs';
import { Constants } from '../../constants';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { PopupService } from '../../services/popup/popup.service';

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
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss',
})
export class AddPostComponent implements OnInit, OnDestroy {
  editor!: Editor;
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private _http = inject(HttpClient);
  private popupService = inject(PopupService);

  form!: FormGroup;

  selectOptions = [
    'Lifestyle',
    'Travel',
    'Health & Wellness',
    'Technology',
    'Business',
    'Food',
    'Personal Development',
    'Art & Crafts',
    'Fashion & Beauty',
    'Reviews',
    'Other',
  ];

  ngOnInit(): void {
    this.editor = new Editor();
    this.form = this.fb.group({
      title: [''],
      content: [''],
      tags: [[]],
      image: [null],
    });
  }

  /**
   * It checks if the form has some unsaved changes when navigating away from the page.
   * @returns a boolean value.
   */
  hasUnsavedChanges(): boolean {
    const { title, content, tags } = this.form.value;
    return !!(title?.trim() || content?.trim() || tags?.length);
  }

  /**
   * It shows warning message to the user about unsaved changes when leaving the page.
   * @returns boolean value indicating whether the user wants to leave the page or not.
   */
  async openPageLeavingConfirmation() {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      data: {
        title: Constants.UNSAVED_DATA_WARNING_TITLE,
        message: Constants.UNSAVED_DATA_WARNING_MSG,
      },
      panelClass: 'leave-page-dialog-panel',
      backdropClass: 'leave-page-dialog-backdrop',
    });
    const value = await lastValueFrom(dialogRef.afterClosed());
    return value === true;
  }

  removeTag(tag: string) {
    this.form.patchValue({
      tags: this.form.value.tags.filter((el: string) => el !== tag),
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.form.patchValue({ image: file });
    }
  }

  savePost() {
    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value);
    formData.append('content', this.form.get('content')?.value);
    formData.append('tag', this.form.get('tags')?.value);
    formData.append('image', this.form.get('image')?.value);
    this._http.post(Constants.CREATE_POST, formData).subscribe(
      (res: any) => {
        this.form.reset();
        this.popupService.showAlertMessage(
          res?.message || Constants.POST_CREATED_MSG,
          Constants.SNACKBAR_SUCCESS
        );
      },
      () => {
        this.popupService.showAlertMessage(Constants.GENERIC_MSG, Constants.SNACKBAR_ERROR);
      }
    );
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
