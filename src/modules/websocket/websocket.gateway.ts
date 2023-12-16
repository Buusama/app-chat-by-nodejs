import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket & { userId?: number }) {
    if (client.userId) {
      client.join(`socket-channel-for-user-${client.userId}`);
    }
  }

  serverSendEvent(event: string, data: any, rooms: string[] = []) {
    this.server.to(rooms).emit(event, data);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    console.log(`Client ${client.id} send message: ${payload.message}`)
  }

  @SubscribeMessage('addFriend')
  handleAddFriend(client: Socket & { userId?: number }, payload: any) {
    console.log(`Client ${client.id} add friend ${payload.receiver_id} `)
    return `Server response at ${Date.now()}`
  }

  @SubscribeMessage('replyFriend')
  handleReplyFriend(client: Socket, payload: any) {
    console.log(`Client ${client.id} reply friend ${payload.sender_id} `)
    return `Server response at ${Date.now()}`
  }
}
