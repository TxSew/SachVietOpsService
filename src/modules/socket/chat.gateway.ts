// chat.gateway.ts

import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(5000, {
    cors: true,
})
export class ChatGateway {
    @WebSocketServer() server: Server;

    @SubscribeMessage('chat')
    handleMessage(client: Socket, message: string): void {
        // Xử lý tin nhắn chat, có thể lưu vào database hoặc gửi lại cho các clients khác
        this.server.emit('chat', message); // Gửi tin nhắn chat đến tất cả các clients
    }
}
