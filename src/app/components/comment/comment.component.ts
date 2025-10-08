import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommentNode } from '../../interfaces';

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
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  public avatar = '/assets/comment-avatar.png';

  data = {
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
  };

  replyingToId: number | null = null;
  replyText = '';

  toggleReply(commentId: number): void {
    this.replyingToId = this.replyingToId === commentId ? null : commentId;
    this.replyText = '';
  }

  cancelReply(): void {
    this.replyingToId = null;
    this.replyText = '';
  }

  submitReply(parent: CommentNode): void {
    const text = this.replyText.trim();
    if (!text) return;

    const newReply: CommentNode = {
      id: Date.now(),
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
