// YourController.ts
import { Controller, Get } from '@nestjs/common';
import { SocketGateway } from '../socket/socket.gateway';

@Controller()
export class MessageController {
    constructor(private readonly socketGateway: SocketGateway) {}

    @Get('send-message')
    sendMessage(): string {
        this.socketGateway.server.emit('message', 'Hello, everyone!'); // Emitting 'message' event
        return 'Message sent3!';
    }
}
