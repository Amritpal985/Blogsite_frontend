import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommentNode } from '../../interfaces';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzFormModule } from 'ng-zorro-antd/form';
import { LoginService } from '../../services/login/login.service';
import { PopupService } from '../../services/popup/popup.service';
import { Constants } from '../../constants';

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
  private loginService = inject(LoginService);
  private popupService = inject(PopupService);

  avatar = '/assets/comment-avatar.png';
  commentText = '';
  submitting = false;
  isUserLoggedIn = false;
  commentAreaPlaceholder = 'please login to add or reply a comment...';

  data: CommentNode[] = [
    {
      id: 1,
      author: 'NK',
      content: 'Parent',
      children: [
        {
          id: 2,
          author: 'AS',
          content: 'Child',
          children: [
            {
              id: 3,
              author: 'NK',
              content: 'Sub-child-1',
            },
            {
              id: 4,
              author: 'NK',
              content: 'Sub-child-2',
            },
          ],
        },
      ],
    },
  ];

  replyingToId: number | null = null;
  replyText = '';
  ids = 10;

  ngOnInit(): void {
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
    this.commentText = '';
    this.ids++;
    this.submitting = false;
    this.data = [
      ...this.data,
      {
        id: this.ids,
        author: 'you',
        content,
      },
    ];
    this.submitting = false;
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
    const text = this.replyText.trim();
    if (!text) return;
    const newReply: CommentNode = {
      id: this.ids++,
      author: 'You',
      content: text,
      children: [],
    };

    if (!parent.children) {
      parent.children = [];
    }

    parent.children.push(newReply);
    this.replyingToId = null;
    this.replyText = '';
  }
}
