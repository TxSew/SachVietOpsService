import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Producer } from 'src/submodules/models/producerModel/producer';

interface ProducerSchema extends Model<InferAttributes<Producer>, InferCreationAttributes<Producer>> {}
export const ProducerModel = SequelizeBase.define<ProducerSchema>(
    'db_producer',
    {
        ...baseAttributes,
        name: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
        },
        keyword: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
    }
);

ProducerModel.beforeCreate((product: Producer) => {
    product.slug = slugify(product.name, { lower: true, strict: true });
});

ProducerModel.beforeUpdate((product: Producer) => {
    product.slug = slugify(product.name, { lower: true, strict: true });
});
