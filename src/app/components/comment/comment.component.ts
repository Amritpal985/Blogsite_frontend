import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
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
})
export class CommentComponent implements OnInit {
  @Input() postId!: number;

  private loginService = inject(LoginService);
  private popupService = inject(PopupService);
  private _http = inject(HttpClient);

  avatar = '/assets/comment-avatar.png';
  commentText = '';
  submitting = false;
  isUserLoggedIn = false;
  commentAreaPlaceholder = 'please login to add or reply a comment...';

  comments: CommentNode[] = [];

  replyingToId: number | null = null;
  replyText = '';

  ngOnInit(): void {
    const url = `${Constants.GET_COMMENTS}/${this.postId}`;
    this._http.get<CommentNode[]>(url).subscribe(
      (res) => {
        this.comments = res;
      },
      (err) => {
        console.log(err);
      }
    );
    // localStorage.setItem("token","dakdbds");
    this.isUserLoggedIn = this.loginService.isUserLoggedIn();
    if (this.isUserLoggedIn) this.commentAreaPlaceholder = 'write a comment...';
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
    this._http.post<CommentResponse>(url, { content }).subscribe(
      (res) => {
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
      },
      (err) => {
        console.log(err);
        this.submitting = false;
      }
    );
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
    this._http.post<CommentResponse>(url, { content }).subscribe(
      (res) => {
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
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
