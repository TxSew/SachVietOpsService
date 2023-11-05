import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ResponseError } from 'src/helpers/ResponseError';
import { Product, TProduct, TProductResponse } from 'src/submodules/models/ProductModel/Product';
import { CategoryModel } from '../Category/category.schema';
import { ProducerModel } from '../Producer/producer.schema';
import { ImagesProductModel } from './dto/listImage.schema';
import { ProductModel } from './product.schema';

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
        const slug = props.slug ? { slug: props.slug } : {};
        const categoryFilter = props.categoryFilter;
        const orderWith = (props.sortWith || 'asc').toLocaleLowerCase() == 'asc' ? 'DESC' : 'ASC';

        let whereClause: any = {
            [Op.or]: [{ title: { [Op.like]: `%${searchQuery}%` } }],
            price_sale: {
                [Op.between]: [minPrice, maxPrice],
            },
        };
        let filterCategory = {};
        if (categoryFilter) {
            filterCategory = {
                slug: categoryFilter,
            };
        }
        try {
            const Product = await ProductModel.findAndCountAll({
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
                    },
                ],
            })
                .then(async (res) => {
                    return JSON.parse(JSON.stringify(res));
                })
                .catch((err) => {
                    throw ResponseError.badInput(`Unable to parse ${err.message}`);
                });
            let totalPage = Math.ceil(Product.count / limited);
            return { totalPage, pageSize: Product.rows.length, limit: limited, page, products: Product.rows };
        } catch (err) {
            throw ResponseError.unexpected(err);
        }
    }
    //get by category
    async getByCategory() {
        const products = ProductModel.findAll({});
    }
    // find One or more products
    async findOneWithRelatedProducts(slug: string) {
        try {
            // Find the product with the provided slug
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
            // Find related products based on the same category
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
                }, // Exclude the current product
                limit: 5, // You can adjust the limit as needed
            });

            return { product, relatedProducts };
        } catch (err) {
            return err;
        }
    }
    //find product by category

    // find One or more products
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
    // create a new Product
    async createProduct(TProduct: Partial<TProduct>): Promise<TProduct> {
        try {
            const { product, productImages } = TProduct;
            if (!product) {
                throw 'product creating not value';
            }
            //  logic % price
            const { sale, price } = product;
            if (sale > 100 && sale < 1) {
                throw ResponseError.badInput('sale not must be greater than 100');
            }
            const priceSale = price - (sale / 100) * price;
            product.price_sale = priceSale;
            //create product
            const ProductData = await ProductModel.create(product);
            //create product images
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
    // update a Product
    async updateProduct(id: number, TProduct: TProduct) {
        const parInt = id;
        const { product, productImages } = TProduct;
        const { sale, price } = product;
        if (sale > 100 && sale < 1) {
            throw ResponseError.badInput('sale not must be greater than 100');
        }
        const priceSale = price - (sale / 100) * price;
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
            console.log(updated);

            for (var i = 0; i < productImages.length; i++) {
                productImages[i].productId = parInt;
                const data = await ImagesProductModel.bulkCreate(productImages);
            }
            return updated;
        } catch (errors) {
            throw ResponseError.badInput('Product update failed');
        }
    }
    //  search a Product
    async removeProductTrashed(id: number) {
        const trashed = await ProductModel.destroy({
            where: { id: id },
        });
        return trashed;
    }
    async restoreProductTrashed(id: number) {
        const trashed = await ProductModel.restore({
            where: { id: id },
        });
        return trashed;
    }
}
