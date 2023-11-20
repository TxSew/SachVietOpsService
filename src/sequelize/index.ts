import { CategoryModel, ImagesProductModel, ProducerModel, ProductModel } from 'src/modules/product';

ProductModel.hasMany(ImagesProductModel, {
    foreignKey: 'productId',
    as: 'productImages',
});

ProductModel.belongsTo(CategoryModel, {
    foreignKey: 'categoryId',
    as: 'category',
});

ProductModel.belongsTo(ProducerModel, {
    foreignKey: 'producerID',
    as: 'producer',
});

export { ProducerModel, CategoryModel, ImagesProductModel };
