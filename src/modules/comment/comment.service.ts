import { Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { UserModel } from '../auth/auth.schema';
import { ProductModel } from '../product/product.schema';
import { CommentModel } from './comment.schema';
import { CommentImgModel } from './commentImages.chema';

@Injectable()
export class CommentService {
    async getCommentByProduct(props: { productId: number; page: number; limit: number }): Promise<any> {
        if (!props.productId) throw ResponseError.badInput('productId is required');
        const limit = props.limit || 4;
        const page = props.page || 1;
        const offset = (Number(page) - 1) * Number(limit);
        const listAll = await CommentModel.findAll({});
        const comments = await CommentModel.findAll({
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
                {
                    model: CommentImgModel,
                    as: 'comment',
                },
            ],

            where: { productId: props.productId },
        });
        return {
            totalPage: Math.ceil(listAll.length / limit) - 1,
            comments: comments,
        };
    }

    async addComment(comment, account): Promise<any> {
        console.log(comment);
        const { content, images } = comment;
        if (!account) throw ResponseError.unauthorized();
        content.userId = Number(account.id);
        console.log('🚀 ~ file: comment.service.ts:43 ~ CommentService ~ addComment ~ content:', content);
        try {
            const comments = await CommentModel.create(content);
            const id = comments.get().id;
            console.log('🚀 ~ file: comment.service.ts:46 ~ CommentService ~ addComment ~ id:', id);
            console.log('🚀 ~ file: comment.service.ts:50 ~ CommentService ~ images.map ~ images:', images);
            images.map((image) => {
                return (image.commentId = id);
            });
            console.log('🚀 ~ file: comment.service.ts:51 ~ CommentService ~ images.map ~ images:', images);
            const data = await CommentImgModel.bulkCreate(images);
            return data;
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
