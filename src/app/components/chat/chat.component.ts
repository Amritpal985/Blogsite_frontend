import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChatMessage, Follower, Message } from '../../interfaces';
import { Constants } from '../../constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  private _http = inject(HttpClient);

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
    const message: Message = { receiver_id: this.activeChatId, message: this.messageToSend };
    this._http.post<Message>(Constants.SEND_MESSAGE_URL, message).subscribe(
      () => {
        this.messageToSend = '';
        // this.chatMessages = [...this.chatMessages, ]
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
