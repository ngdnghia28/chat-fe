import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { MessageI, MessagePaginateI } from 'src/app/model/message.interface';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { CustomSocket } from '../../sockets/custom-socket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: CustomSocket, private snackbar: MatSnackBar) {

    // socket.connect();

    socket.on('details', (v) => {
      console.log('-----------', v)
    })

    socket.on('disconnected', () => {
      console.log('disconnected')
    })
  }

  getAddedMessage(): Observable<MessageI> {
    return this.socket.fromEvent<MessageI>('messageAdded');
  }

  sendMessage(message: { text: string, type: string, mediaUrl?: string, roomId: string }) {
    this.socket.emit('addMessage', message);
  }

  sendRead(dto: { messageId: string, roomId: string }) {
    this.socket.emit('readMessage', dto);
  }

  joinRoom(room: RoomI) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: RoomI) {
    this.socket.emit('leaveRoom', room);
  }

  getMessages(): Observable<MessagePaginateI> {
    return this.socket.fromEvent<MessagePaginateI>('messages');
  }

  getMyRooms(): Observable<RoomPaginateI> {
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  emitPaginateRooms(limit: number, page: number) {
    console.log(this.socket.ioSocket.connected)
    this.socket.emit('paginateRooms', { limit, page });
  }

  createRoom(room: RoomI) {
    this.socket.emit('createRoom', room);
    this.snackbar.open(`Room ${room.name} created successfully`, 'Close', {
      duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
    });
  }

}
