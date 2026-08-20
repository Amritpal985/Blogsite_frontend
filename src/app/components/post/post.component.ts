import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../interfaces';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../constants';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { PopupService } from '../../services/popup/popup.service';
import { QuillViewComponent } from 'ngx-quill';
import DOMPurify from 'dompurify';
import { CommentComponent } from '../comment/comment.component';
import { SkeletonModule } from 'primeng/skeleton';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    QuillViewComponent,
    CommentComponent,
    SkeletonModule,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private _http = inject(HttpClient);
  private popupService = inject(PopupService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  isLoading = false;
  postId: string | null = null;
  post!: Post;

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.postId = params.get('id');
          const url = `${Constants.GET_POST}/${this.postId}`;
          return this._http.get<Post>(url);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.post = {
            ...res,
            formatted_tags: res?.tags?.split(','),
            content: DOMPurify.sanitize(res.content, {
              ALLOWED_TAGS: ['b', 'i', 'a', 'ul', 'li'],
            }),
          };
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.popupService.showAlertMessage(Constants.GENERIC_MSG, Constants.SNACKBAR_ERROR);
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
