import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../interfaces';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../constants';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PopupService } from '../../services/popup/popup.service';
import { QuillViewComponent } from 'ngx-quill';
import DOMPurify from 'dompurify';
import { CommentComponent } from '../comment/comment.component';
import { SkeletonModule } from 'primeng/skeleton';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-post',
  imports: [DatePipe, QuillViewComponent, CommentComponent, SkeletonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private _http = inject(HttpClient);
  private popupService = inject(PopupService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

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
        takeUntilDestroyed(this.destroyRef)
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
}
