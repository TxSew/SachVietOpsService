import { Injectable, Param } from '@nestjs/common';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { Category } from 'src/submodules/models/ProductModel/Category';
import CategoryModel from './category.schema';
import { Sequelize } from 'sequelize';

@Injectable()
export class CategoryService {
  async getAll() {
    const query = `
    WITH RECURSIVE CategoryTree AS (
      SELECT id, parentId, name, slug
      FROM db_category
      WHERE id = 9
      UNION ALL
      SELECT c.id, c.parentId, c.name, c.slug
      FROM db_category c
      JOIN CategoryTree ct ON c.parentId = ct.id
    )
    SELECT * FROM CategoryTree;
  `;

    const [results] = await SequelizeBase.query(query);

    const nestedCategories = this.buildCategoryHierarchy(results);

    return nestedCategories;
  }

  async buildCategoryHierarchy(categories) {
    const categoryMap = {};
    const rootCategories = [];

    categories.forEach((category) => {
      category.subcategories = [];
      categoryMap[category.id] = category;

      if (category.parentId === 9) {
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
  async createCategory(category) {
    console.log(category);
    const existingCategory = await CategoryModel.findOne({
      where: { name: category.name },
    });
    console.log(existingCategory);
    if (existingCategory) {
      throw 'Name already exists';
    }
    const data = await CategoryModel.create(category);
    console.log(data);
    return data;
  }

  async updateCategory(id: number, category: Category) {
    console.log(id);
    console.log(category);
    const update = await CategoryModel.update(category, {
      where: { id: id },
    });
    return update;
  }
  async removeCategory(id: number) {
    try {
      const destroy = await CategoryModel.destroy({
        where: { id: id },
      });
      return destroy;
    } catch (err) {
      return ` ${err.message}`;
    }
  }
}
