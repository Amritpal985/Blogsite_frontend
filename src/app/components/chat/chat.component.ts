import { HttpClient } from '@angular/common/http';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ChatMessage, Follower } from '../../interfaces';
import { Constants } from '../../constants';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../services/websocket/websocket.service';
import { PopupService } from '../../services/popup/popup.service';

@Component({
  selector: 'app-chat',
  imports: [MatIconModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  private _http = inject(HttpClient);
  private wsService = inject(WebSocketService);
  private popupService = inject(PopupService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  private readonly chatContainer = viewChild.required<ElementRef>('chatContainer');

  followers: Follower[] = [];
  activeChatId = 0;
  chatMessages: ChatMessage[] = [];
  messageToSend = '';

  ngOnInit(): void {
    this._http
      .get<{ followers: Follower[] }>(Constants.GET_ALL_FOLLOWERS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.followers = res.followers;
          this.activeChatId = this.followers[0]?.id;
          if (this.activeChatId) this.getChatMessages(this.activeChatId);
          this.cdr.markForCheck();
        },
        error: () => {
          this.popupService.showAlertMessage(Constants.GENERIC_MSG, Constants.SNACKBAR_ERROR);
        },
      });
    const url = `${Constants.WEBSOCKET_MESSAGE_URL}/${localStorage.getItem('user_id')}`;
    this.wsService.connect(url);
    this.wsService.messages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((msg) => {
      this.messageToSend = '';
      this.chatMessages.push(msg);
      this.cdr.markForCheck();
    });
  }

  ngAfterViewChecked(): void {
    try {
      this.chatContainer().nativeElement.scrollTop =
        this.chatContainer().nativeElement.scrollHeight;
    } catch {
      // do nothing
    }
  }

  /**
   * It fetches history of chat messages.
   * @param userId of the selected user.
   */
  getChatMessages(userId: number) {
    this.chatMessages = [];
    const url = `${Constants.GET_CHAT_HISTORY}/${userId}`;
    this._http
      .get<{ messages: ChatMessage[] }>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.chatMessages = res.messages;
          this.cdr.markForCheck();
        },
        error: () => {
          this.popupService.showAlertMessage(Constants.GENERIC_MSG, Constants.SNACKBAR_ERROR);
        },
      });
  }

  /**
   * It triggers when user changes the user for chat.
   * @param id of the selected user.
   */
  onChatChange(id: number) {
    this.activeChatId = id;
    this.getChatMessages(this.activeChatId);
  }

  /**
   * It sends message with help of a websocket.
   */
  sendMessage() {
    const message: ChatMessage = { receiver_id: this.activeChatId, message: this.messageToSend };
    this.wsService.sendMessage(message);
  }

  /**
   * Cleans up any pending subscriptions.
   */
  ngOnDestroy(): void {
    this.wsService.close();
  }
}
