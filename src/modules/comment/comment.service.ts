import { Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { UserModel } from '../auth/auth.schema';
import { ProductModel } from '../product/product.schema';
import { CommentModel } from './comment.schema';

@Injectable()
export class CommentService {
    async getCommentByProduct(props: { productId: number; page: number; limit: number }): Promise<any> {
        if (!props.productId) throw ResponseError.badInput('productId is required');
        const limit = props.limit || 4;
        const page = props.page || 1;
        const offset = (Number(page) - 1) * Number(limit);

        const comments = await CommentModel.findAndCountAll({
            limit: Number(limit),
            offset: offset,
            include: [
                {
                    model: UserModel,
                    as: 'userComment',
                },
                {
                    model: ProductModel,
                    as: 'productComment',
                },
            ],

            where: { productId: props.productId },
        });
        return {
            totalPage: comments.count,
            comments: comments.rows,
        };
    }

    async addComment(comment, account) {
        if (!account) throw ResponseError.unauthorized();
        comment.userId = account.id;
        try {
            await CommentModel.create(comment);
        } catch (err) {
            throw ResponseError.badInput(err);
        }
    }

    async updateComment(
        comment: {
            id: number;
            productId: number;
        },
        account
    ) {
        if (!account) throw ResponseError.unauthorized();
        if (comment.productId) throw ResponseError.badInput('product not found');

        const update = await CommentModel.update(comment, {
            where: { userId: account.id, productId: comment.productId },
        });
        return update;
    }

    async deleteCommentByUser(
        props: {
            id: number;
            productId: number;
        },
        account
    ) {
        if (!account) throw ResponseError.unauthorized();
        const remove = await CommentModel.destroy({
            where: {
                id: props.id,
                productId: props.productId,
            },
        });
        return remove;
    }
}
