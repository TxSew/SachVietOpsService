// socket.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
    @WebSocketServer() server: Server;
    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any): void {
        this.server.emit('message', payload);
    }
}
