import { Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { CommentModel } from './comment.schema';

@Injectable()
export class CommentService {
    async getCommentByProduct() {
        CommentModel.findAll({});
    }
    async addComment(comment, account) {
        if (!account) throw ResponseError.unauthorized();
        CommentModel.create(comment)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                throw ResponseError.badInput(err);
            });
    }
    async updateComment(comment, account) {
        if (!account) throw ResponseError.unauthorized();
        if (comment.productId) throw ResponseError.badInput('product not found');

        const update = await CommentModel.update(comment, {
            where: { userId: account.id, productId: comment.productId },
        });
        return update;
    }
}
