import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommentNode, CommentResponse } from '../../interfaces';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzFormModule } from 'ng-zorro-antd/form';
import { LoginService } from '../../services/login/login.service';
import { PopupService } from '../../services/popup/popup.service';
import { Constants } from '../../constants';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    NzAvatarModule,
    NzCommentModule,
    NzIconModule,
    NzToolTipModule,
    NzButtonModule,
    NzInputModule,
    FormsModule,
    NzListModule,
    NzFormModule,
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input() postId!: number;

  private loginService = inject(LoginService);
  private popupService = inject(PopupService);
  private _http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();
  avatar = '/assets/comment-avatar.png';
  commentText = '';
  submitting = false;
  isUserLoggedIn = false;
  commentAreaPlaceholder = 'please login to add or reply a comment...';

  comments: CommentNode[] = [];
  commentsLoading = false;

  replyingToId: number | null = null;
  replyText = '';

  ngOnInit(): void {
    this.commentsLoading = true;
    const url = `${Constants.GET_COMMENTS}/${this.postId}`;
    this._http
      .get<CommentNode[]>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.comments = res;
          this.commentsLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.commentsLoading = false;
          this.cdr.markForCheck();
        },
      });
    this.loginService.loginSubject$
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isUserLoggedIn = this.loginService.isUserLoggedIn();
        this.commentAreaPlaceholder = this.isUserLoggedIn
          ? 'write a comment...'
          : 'please login to add or reply a comment...';
        if (!this.isUserLoggedIn) {
          this.replyingToId = null;
          this.replyText = '';
        }
        this.cdr.markForCheck();
      });
  }

  /**
   * It submits a comment.
   */
  submitComment() {
    if (!this.isUserLoggedIn) {
      this.popupService.showAlertMessage(Constants.USER_NOT_LOGGED_IN, Constants.SNACKBAR_WARNING);
      return;
    }
    this.submitting = true;
    const content = this.commentText;
    const url = `${Constants.ADD_COMMENT}/${this.postId}`;
    this._http
      .post<CommentResponse>(url, { content })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.commentText = '';
          this.comments = [
            ...this.comments,
            {
              id: res.comment.id,
              author_name: res.comment.author_name,
              content,
            },
          ];
          this.submitting = false;
          this.popupService.showAlertMessage(res.message, Constants.SNACKBAR_SUCCESS);
          this.cdr.markForCheck();
        },
        error: () => {
          this.submitting = false;
          this.cdr.markForCheck();
        },
      });
  }

  /**
   * It toggles comment's reply textbox.
   * @param commentId of the comment user is replying to.
   * @returns void.
   */
  toggleReply(commentId: number): void {
    if (!this.isUserLoggedIn) {
      this.popupService.showAlertMessage(Constants.USER_NOT_LOGGED_IN, Constants.SNACKBAR_WARNING);
      return;
    }
    this.replyingToId = this.replyingToId === commentId ? null : commentId;
    this.replyText = '';
  }

  /**
   * It closes the reply textbox.
   */
  cancelReply(): void {
    this.replyingToId = null;
    this.replyText = '';
  }

  /**
   * It submits reply to a comment.
   * @param parent comment user is replying to.
   * @returns void.
   */
  submitReply(parent: CommentNode): void {
    const content = this.replyText.trim();
    if (!content) return;

    const url = `${Constants.REPLY_TO_COMMENT}/${parent.id}`;
    this._http
      .post<CommentResponse>(url, { content })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const reply: CommentNode = {
            id: res.comment.id,
            author_name: res.comment.author_name,
            content,
            children: [],
          };
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(reply);
          this.replyingToId = null;
          this.replyText = '';
          this.popupService.showAlertMessage(res.message, Constants.SNACKBAR_SUCCESS);
          this.cdr.markForCheck();
        },
        error: () => {
          this.popupService.showAlertMessage(Constants.GENERIC_MSG, Constants.SNACKBAR_ERROR);
          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Cleans up any pending subscriptions.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
