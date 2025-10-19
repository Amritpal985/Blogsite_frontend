import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChatMessage, Follower } from '../../interfaces';
import { Constants } from '../../constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../services/websocket.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  private _http = inject(HttpClient);
  private wsService = inject(WebSocketService);
  private destroy$ = new Subject<void>();

  followers: Follower[] = [];
  activeChatId = 0;
  chatMessages: ChatMessage[] = [];
  messageToSend = '';

  ngOnInit(): void {
    this._http.get<Follower[]>(Constants.GET_ALL_FOLLOWERS).subscribe(
      (res: any) => {// eslint-disable-line
        this.followers = res.followers;
        this.activeChatId = this.followers[0].id;
        this.getChatMessages(this.activeChatId);
      },
      (err) => {
        console.log(err);
      }
    );
    const url = `${Constants.WEBSOCKET_MESSAGE_URL}/${localStorage.getItem('user_id')}`;
    this.wsService.connect(url);
    this.wsService.messages$.pipe(takeUntil(this.destroy$)).subscribe((msg) => {
      this.messageToSend = '';
      this.chatMessages.push(msg);
    });
  }

  getChatMessages(userId: number) {
    this.chatMessages = [];
    const url = `${Constants.GET_CHAT_HISTORY}/${userId}`;
    this._http.get<ChatMessage[]>(url).subscribe(
      (res: any) => {// eslint-disable-line
        this.chatMessages = res.messages;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onChatChange(id: number) {
    this.activeChatId = id;
    this.getChatMessages(this.activeChatId);
  }

  sendMessage() {
    const message: ChatMessage = { receiver_id: this.activeChatId, message: this.messageToSend };
    // this._http.post<ChatMessage>(Constants.SEND_MESSAGE_URL, message).subscribe(
    //   (res:ChatMessage) => {
    //     res.message = this.messageToSend;
    //     this.messageToSend = '';
    //     this.chatMessages = [...this.chatMessages, res]
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
    this.wsService.sendMessage(message);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.close();
  }
}
