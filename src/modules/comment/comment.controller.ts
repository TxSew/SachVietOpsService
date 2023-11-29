import { Body, Controller, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CurrentAccount } from 'src/guard/currentUser';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}
    @Post('filter')
    getCommentByProduct() {
        return this.commentService.getCommentByProduct()
    }
    @Post('store')
    addCommentByUser(@Body() comment, @CurrentAccount() account) {
        return this.commentService.addComment(comment, account);
    }
    updateCommentByUser(@Body() comment, @CurrentAccount() account) {
        return this.commentService.updateComment(comment, account);
    }
}
