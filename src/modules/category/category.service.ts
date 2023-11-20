import { Injectable } from '@nestjs/common';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { ResponseError } from 'src/helpers/ResponseError';
import { Category } from 'src/submodules/models/ProductModel/Category';
import { CategoryModel } from './category.schema';
import { CategoryQueryDto } from './dto/Category.schema';

@Injectable()
export class CategoryService {
    async getAll(query: CategoryQueryDto): Promise<any> {
        const limit = query.limit || 4;
        const page = query.page || 1;
        const limited = Number(limit);
        const offset = (Number(page) - 1) * limited;
        const qr = `
        WITH RECURSIVE CategoryTree AS (
            SELECT
              c.id,
              c.parentId,
              c.name,
              c.slug,
              c.createdAt,
              c.deletedAt,
              c.image,
              p.name AS parentName -- Thêm cột parentName để hiển thị tên danh mục cha
            FROM db_category c
            LEFT JOIN db_category p ON c.parentId = p.id
            WHERE c.id = 1 AND c.deletedAt IS NULL
            UNION ALL
            SELECT
              c.id,
              c.parentId,
              c.name,
              c.slug,
              c.createdAt,
              c.deletedAt,
              c.image,
              p.name AS parentName -- Thêm cột parentName để hiển thị tên danh mục cha
            FROM db_category c
            JOIN CategoryTree ct ON c.parentId = ct.id
            LEFT JOIN db_category p ON c.parentId = p.id
            WHERE c.deletedAt IS NULL
          )
          SELECT * FROM CategoryTree t ORDER BY t.createdAt DESC LIMIT ${limited} OFFSET ${offset}
    `;
        const [results] = await SequelizeBase.query(qr);
        const getAll = await this.filter();
        const totalPage = Math.ceil(getAll.length / limited);
        return { totalPage, limit: limited, page, category: results };
    }

    async buildCategoryHierarchy(categories) {
        const categoryMap = {};
        const rootCategories = [];
        categories.forEach((category) => {
            category.subcategories = [];
            categoryMap[category.id] = category;
            if (category.parentId === 1) {
                rootCategories.push(category);
            } else {
                const parentCategory = categoryMap[category.parentId];
                if (parentCategory) {
                    parentCategory.subcategories.push(category);
                }
            }
        });
        return rootCategories;
    }

    async filter() {
        const query = `
    WITH RECURSIVE CategoryTree AS (
      SELECT
        c.id,
        c.parentId,
        c.name,
        c.slug,
        c.deletedAt,
        c.image,
        p.name AS parentName -- Thêm cột parentName để hiển thị tên danh mục cha
      FROM db_category c
      LEFT JOIN db_category p ON c.parentId = p.id
      WHERE c.id = 1 AND c.deletedAt IS NULL
      UNION ALL
      SELECT
        c.id,
        c.parentId,
        c.name,
        c.slug,
        c.deletedAt,
        c.image,
        p.name AS parentName -- Thêm cột parentName để hiển thị tên danh mục cha
      FROM db_category c
      JOIN CategoryTree ct ON c.parentId = ct.id
      LEFT JOIN db_category p ON c.parentId = p.id
      WHERE c.deletedAt IS NULL
    )
    SELECT * FROM CategoryTree;
  `;
        const [results] = await SequelizeBase.query(query);
        return results;
    }

    async getOne(id: number) {
        const category = await CategoryModel.findOne({
            where: {
                id: id,
            },
        });
        return category;
    }

    async createCategory(props: Partial<Category>): Promise<Category> {
        const existingCategory = await CategoryModel.findOne({
            where: { name: props.name },
        });

        if (existingCategory) throw ResponseError.badInput('Name already exists');

        const category = await CategoryModel.create(props);
        return category;
    }

    async updateCategory(id: number, category: Category) {
        if (!category) throw ResponseError.badInput('Category not found');

        const update = await CategoryModel.update(category, {
            where: { id: id },
        });

        return update;
    }

    async removeCategory(id: number) {
        const destroy = await CategoryModel.destroy({
            where: { id: id },
        });
        return destroy;
    }
}
