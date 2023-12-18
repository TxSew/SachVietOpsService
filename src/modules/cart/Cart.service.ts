import { Injectable } from '@nestjs/common';
import { ImagesProductModel, ProductModel } from '../product';
import { ResponseError } from 'src/helpers/ResponseError';
import { CartModel } from './Cart.schema';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
    constructor(private productService: ProductService) {}
    async getCart(id: number) {
        if (!id) throw ResponseError.notFound('user not found');
        try {
            return CartModel.findAll({
                where: { userId: id },
                include: [
                    {
                        model: ProductModel,
                        as: 'productCart',
                    },
                ],
            });
        } catch (err) {
            console.log(err);
        }
    }
    async addToCart(props, userId: number) {
        try {
            const { productId, quantity } = props;

            const cartItem = {
                productId,
                quantity,
                userId,
            };

            const qty = parseInt(quantity || 1);

            let cart = (await CartModel.findOne({
                where: {
                    productId: productId,
                    userId: userId,
                },
            })) as any;

            if (!cart) {
                const data = await CartModel.create(cartItem);
                cart.total += cart.item.price * quantity;
                cart = data;
                return cart;
            }

            const product = await this.productService.findOneUpdate(productId);

            const existingCartItem = await cart.dataValues;

            if (existingCartItem) {
                if (existingCartItem.quantity + qty > product.dataValues.quantity) {
                    throw ResponseError.badInput(
                        `Bạn đã có ${existingCartItem.quantity} sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.`
                    );
                }
            } else {
                if (qty > product.dataValues.quantity) {
                    throw ResponseError.badInput(
                        `Bạn đã có ${existingCartItem.quantity} sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.`
                    );
                }
            }

            const updatedCart = await CartModel.update(cartItem, {
                where: {
                    userId: userId,
                    productId: productId,
                },
            });
            return updatedCart;
        } catch (error) {
            console.error('error', error);
            throw ResponseError.badInput(error);
        }
    }
}
