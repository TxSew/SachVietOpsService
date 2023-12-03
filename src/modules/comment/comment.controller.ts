import { Body, Controller, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CurrentAccount } from 'src/guard/currentUser';
import { Public } from 'src/guard/jwtGuard';
import { promises } from 'readline';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Public()
    @Post('filter')
    getCommentByProduct(@Body() props: { productId; page: number; limit: number }): Promise<any> {
        return this.commentService.getCommentByProduct(props);
    }

    @Post('store')
    addCommentByUser(@Body() comment, @CurrentAccount() account): Promise<any> {
        return this.commentService.addComment(comment, account);
    }

    @Post('update')
    updateCommentByUser(@Body() props: { id: number; productId: number }, @CurrentAccount() account) {
        return this.commentService.updateComment(props, account);
    }

    @Post('delete')
    deleteCommentByUser(@Body() props: { id: number; productId: number }, @CurrentAccount() account) {
        return this.commentService.deleteCommentByUser(props, account);
    }
}
