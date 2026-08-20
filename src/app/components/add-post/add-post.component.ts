import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { QuillEditorComponent } from 'ngx-quill';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';
import { lastValueFrom } from 'rxjs';
import { Constants } from '../../constants';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { PopupService } from '../../services/popup/popup.service';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-post',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    QuillEditorComponent,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent implements OnInit {
  readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  private cdr = inject(ChangeDetectorRef);
  private popupService = inject(PopupService);
  private loginService = inject(LoginService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private _http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

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
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [[], Validators.required],
      image: [null],
    });
    this.loginService.loginSubject$
      .asObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const isUserLoggedIn = this.loginService.isUserLoggedIn();
        if (!isUserLoggedIn) this.router.navigate(['']);
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

  /**
   * It removes a tag from the list of selected tags.
   * @param tag to be remove.
   */
  removeTag(tag: string) {
    this.form.patchValue({
      tags: this.form.value.tags.filter((el: string) => el !== tag),
    });
  }

  /**
   * It triggers when user changes the image chosen.
   * @param event of file selection.
   */
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.form.patchValue({ image: file });
    }
  }

  /**
   * It prepares the data and saves a post.
   */
  savePost() {
    if (!this.form.valid) {
      this.popupService.showAlertMessage(Constants.INVALID_FORM_MSG, Constants.SNACKBAR_WARNING);
      return;
    }
    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value);
    formData.append('content', this.form.get('content')?.value);
    formData.append('tag', this.form.get('tags')?.value);
    formData.append('image', this.form.get('image')?.value);
    this._http
      .post<{ message?: string }>(Constants.CREATE_POST, formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.form.reset();
          this.fileInput().nativeElement.value = '';
          this.cdr.markForCheck();
          this.popupService.showAlertMessage(
            res?.message || Constants.POST_CREATED_MSG,
            Constants.SNACKBAR_SUCCESS
          );
        },
        error: () => {
          this.popupService.showAlertMessage(Constants.GENERIC_MSG, Constants.SNACKBAR_ERROR);
        },
      });
  }
}
