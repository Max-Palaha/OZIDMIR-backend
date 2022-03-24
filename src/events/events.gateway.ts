import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { IUser } from '../modules/users/interfaces';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateway');

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
  }
  handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);
  }

  @WebSocketServer() server: Server;
  afterInit() {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('events')
  findAll(): Observable<WsResponse<number>> {
    this.server.emit('notification', 'dss');

    return from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, user: IUser | undefined) {
    if (user) {
      client.join(user.id.toString());
    }
  }

  async sendNotification(user: IUser, message: string): Promise<void> {
    this.server.to(user.id.toString()).emit('notification', { user, message });
  }
}
