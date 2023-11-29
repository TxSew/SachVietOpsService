import { Body, Controller } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller()
export class CommentController {
    constructor(private commentService: CommentService) {}
    addComment(@Body() comment) {
        return this.commentService.addComment(comment);
    }
}
