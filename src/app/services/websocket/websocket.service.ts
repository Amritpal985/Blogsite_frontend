import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from '../../interfaces';
import { PopupService } from '../popup/popup.service';
import { Constants } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private messageSubject = new Subject<ChatMessage>();
  private popupService = inject(PopupService);

  /**
   * It opens a websocket for the user.
   * @param url of the host.
   */
  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const data: ChatMessage = JSON.parse(event.data);
      this.messageSubject.next(data);
    };

    this.socket.onerror = () => {
      this.popupService.showAlertMessage(Constants.WEBSOCKET_ERROR_MSG, Constants.SNACKBAR_ERROR);
    };

    this.socket.onclose = () => {
      //
    };
  }

  /**
   * Get incoming messages.
   */
  get messages$(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }

  /**
   * Sends a message with help of an open websocket.
   * @param message to be send.
   */
  sendMessage(message: ChatMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open.');
    }
  }

  /**
   * Close the open websocket.
   */
  close(): void {
    this.socket?.close();
  }
}
