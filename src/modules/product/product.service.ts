import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ResponseError } from 'src/helpers/ResponseError';
import { Product, TProduct, TProductResponse } from 'src/submodules/models/ProductModel/Product';
import { CategoryModel } from '../category/category.schema';
import { ProducerModel } from '../producer/producer.schema';
import { ImagesProductModel } from './dto/listImage.schema';
import { ProductModel } from './product.schema';
import { OrderDetail } from 'src/submodules/models/OrderModel/Order';

@Injectable()
export class ProductService {
    //find all products
    async findAll(props): Promise<TProductResponse> {
        const limit = props.limit || 8;
        const page = props.page || 1;
        const limited = Number(limit);
        const offset = (Number(page) - 1) * limited;
        const minPrice = props.sortMinPrice || 1;
        const maxPrice = props.sortMaxPrice || 200000000000;
        const searchQuery = props.keyword || '';
        const ct = props.categoryFilter;
        const orderWith = (props.sortWith || 'asc').toLocaleLowerCase() == 'asc' ? 'DESC' : 'ASC';

        let filterCategory = {};
        let filterProducer = {};

        let whereClause: any = {
            [Op.or]: [{ title: { [Op.like]: `%${searchQuery}%` } }],
            price_sale: {
                [Op.between]: [minPrice, maxPrice],
            },
        };

        if (props.filter == 1) {
            whereClause = {
                [Op.or]: [{ title: { [Op.like]: `%${searchQuery}%` } }],
                price_sale: {
                    [Op.between]: [minPrice, maxPrice],
                },
                [Op.or]: [{ title: { [Op.like]: `%${searchQuery}%` } }],
                sale: {
                    [Op.gt]: 1,
                },
            };
        } else if (props.filter == 2) {
            whereClause = {
                [Op.or]: [{ title: { [Op.like]: `%${searchQuery}%` } }],
                price_sale: {
                    [Op.between]: [minPrice, maxPrice],
                },
                [Op.or]: [{ title: { [Op.like]: `%${searchQuery}%` } }],
                soldQuantity: {
                    [Op.gt]: 1,
                },
            };
        }

        if (ct)
            filterCategory = {
                slug: props.categoryFilter,
            };

        if (props.producerFilter) {
            filterProducer = {
                id: props.producerFilter,
            };
        }
        try {
            const Product = await ProductModel.findAll({
                where: whereClause,
                limit: limited,
                offset,
                order: [[props.sortBy || 'createdAt', orderWith]],
                include: [
                    {
                        model: ImagesProductModel,
                        attributes: ['image', 'id'],
                        as: 'productImages',
                    },
                    {
                        model: CategoryModel,
                        attributes: ['name', 'parentId', 'id', 'slug'],
                        as: 'category',
                        where: filterCategory,
                    },
                    {
                        model: ProducerModel,
                        attributes: ['name', 'id', 'code'],
                        as: 'producer',
                        where: filterProducer,
                    },
                ],
            })
                .then(async (res) => {
                    return JSON.parse(JSON.stringify(res));
                })
                .catch((err) => {
                    throw ResponseError.badInput(`Unable to parse ${err.message}`);
                });
            const getAll: any = await ProductModel.findAll({});
            let totalPage = Math.ceil(getAll.length / limited);
            return { totalPage, pageSize: Product.length, limit: limited, page, products: Product };
        } catch (err) {
            throw ResponseError.unexpected(err);
        }
    }
    async findOneWithRelatedProducts(slug: string) {
        try {
            const product = await ProductModel.findOne({
                include: [
                    {
                        model: ImagesProductModel,
                        attributes: ['image', 'id'],
                        as: 'productImages',
                    },
                    {
                        model: CategoryModel,
                        as: 'category',
                    },
                    {
                        model: ProducerModel,
                        as: 'producer',
                    },
                ],
                where: { slug: slug },
            });

            if (!product) {
                throw ResponseError.notFound('Product not found');
            }

            const relatedProducts = await ProductModel.findAll({
                include: [
                    {
                        model: ImagesProductModel,
                        attributes: ['image', 'id'],
                        as: 'productImages',
                    },
                    {
                        model: CategoryModel,
                        as: 'category',
                    },
                    {
                        model: ProducerModel,
                        as: 'producer',
                    },
                ],
                where: {
                    categoryId: product.get().categoryId,
                    id: { [Op.not]: product.get().id },
                },
                limit: 5,
            });

            return { product, relatedProducts };
        } catch (err) {
            return err;
        }
    }

    async findOneUpdate(id: number): Promise<Product> {
        try {
            const findOne = await ProductModel.findOne({
                include: [
                    {
                        model: ImagesProductModel,
                        as: 'productImages',
                    },
                ],
                where: { id: id },
            });
            if (!findOne) {
                throw 'Product not found';
            }
            return findOne;
        } catch (err) {
            return err;
        }
    }

    async createProduct(TProduct: Partial<TProduct>): Promise<TProduct> {
        try {
            const { product, productImages } = TProduct;
            if (!product) {
                throw 'product creating not value';
            }

            const { sale, price } = product;
            let priceSale: number;
            priceSale = price - (Number(sale) / 100) * price;
            product.price_sale = priceSale;

            const ProductData = await ProductModel.create(product);

            let id = ProductData.get().id;
            productImages.map((product) => (product.productId = id));
            const data = await ImagesProductModel.bulkCreate(productImages);
            return {
                productImages: data,
                product: ProductData,
            };
        } catch (err) {
            throw ResponseError.badInput(err.message);
        }
    }

    async updateProduct(id: number, TProduct: TProduct) {
        const parInt = id;
        const { product, productImages } = TProduct;
        const { sale, price } = product;

        if (Number(sale) > 100 && Number(sale) < 1) {
            throw ResponseError.badInput('sale not must be greater than 100');
        }

        if (!sale) sale == 0;
        const priceSale = price - (Number(sale) / 100) * price;
        product.price_sale = priceSale;

        if (productImages.length > 0) {
            const destroy = await ImagesProductModel.destroy({
                where: { productId: parInt },
            });
            console.log(destroy);
        }
        try {
            const updated = await ProductModel.update(product, {
                where: { id: parInt },
            });

            const newImages = productImages.map((image: any) => {
                image.productId = parInt;
                return image;
            });

            await ImagesProductModel.bulkCreate(newImages);
            return updated;
        } catch (errors) {
            throw ResponseError.badInput('Product update failed');
        }
    }
    async checkQuantity(props: { productId: number; quantity: number }) {
        if (!props.productId) throw ResponseError.badInput('Product not found');
        if (!props.quantity) throw ResponseError.badInput('Product not quantity');
        const product = await ProductModel.findOne({
            where: { id: props.productId },
        });
        if (props.quantity > product.get().quantity)
            throw ResponseError.badInput('quantity exceeds quantity Inventory');
        return {
            message: 'quantity successfully',
        };
    }
    async UpdateProductInventory(props) {
        try {
            const { id, newQuantity } = props;
            if (!id && !newQuantity) throw ResponseError.badInput('productInventory empty value!');

            const product = await ProductModel.findOne({
                where: { id: id },
            });

            const soldInventoryProduct = product.get().soldInventory + Number(newQuantity);
            const quantity = product.get().quantity + Number(newQuantity);

            await ProductModel.update(
                {
                    soldInventory: soldInventoryProduct,
                    quantity: quantity,
                },
                {
                    where: { id: id },
                }
            );

            return {
                message: 'updateProductInventory Success',
            };
        } catch (err) {
            console.log(err);
        }
    }

    async removeProductTrashed(id: number) {
        try {
            const trashed = await ProductModel.destroy({
                where: { id: id },
            });
            return trashed;
        } catch (err) {
            throw ResponseError.badInput({
                message: {
                    message: 'orderDetail have value',
                },
            });
        }
    }

    async restoreProductTrashed(id: number) {
        const trashed = await ProductModel.restore({
            where: { id: id },
        });
        return trashed;
    }

    async updateQuantity(props: OrderDetail[]) {
        await props.map(async (e) => {
            const product: any = await ProductModel.findOne({
                where: { id: e.productId },
            });
            let quantity = (await product.quantity) - Number(e.quantity);
            const soldQuantity = (await product.soldQuantity) + Number(e.quantity);

            await ProductModel.update(
                { quantity: quantity, soldQuantity: soldQuantity },
                {
                    where: { id: product.get().id },
                }
            );
        });
    }
}
