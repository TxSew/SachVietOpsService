import { Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { UserModel } from '../auth/auth.schema';
import { ProductModel } from '../product/product.schema';
import { CommentModel } from './comment.schema';
import { CommentImgModel } from './commentImages.chema';
import { OrderDetailModel } from '../order/dto/orderDetail.schema';

@Injectable()
export class CommentService {
    async getCommentByProduct(props: { productId: number; page: number; limit: number }): Promise<any> {
        if (!props.productId) throw ResponseError.badInput('productId is required');
        const limit = props.limit || 4;
        const page = props.page || 1;
        const offset = (Number(page) - 1) * Number(limit);
        const listAll = await CommentModel.findAll({
            where: { productId: props.productId },
        });
        const comments = await CommentModel.findAll({
            order: [['createdAt', 'DESC']],
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
            totalPage: Math.ceil(listAll.length / limit),
            comments: comments,
        };
    }

    async addComment(comment, account): Promise<any> {
        const { content, images } = comment;
        if (!account) throw ResponseError.unauthorized();
        content.userId = Number(account.id);
        try {
            const comments = await CommentModel.create(content);
            const id = comments.get().id;

            images.map((image) => {
                return (image.commentId = id);
            });
            await CommentImgModel.bulkCreate(images);
            await OrderDetailModel.update(
                {
                    status: 1,
                },
                {
                    where: { id: content.idOrderDetail },
                }
            );

            return comments;
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
