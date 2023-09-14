import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { Category } from 'src/submodules/models/ProductModel/Category';
import CategoryModel from './category.schema';

@Injectable()
export class CategoryService {
  async getAll() {
    const query = `
    WITH RECURSIVE CategoryTree AS (
      SELECT id, parentId, name, slug
      FROM db_category
      WHERE id = 2
      UNION ALL
      SELECT c.id, c.parentId, c.name, c.slug
      FROM db_category c
      JOIN CategoryTree ct ON c.parentId = ct.id
    )
    SELECT * FROM CategoryTree;
  `;
    const [results] = await SequelizeBase.query(query);
console.log(results);

    const nestedCategories = this.buildCategoryHierarchy(results);

    return nestedCategories;
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
  //category 
  async createCategory(category) {
     try {
     const existingCategory = await CategoryModel.findOne({
      where: { name: category.name },
    });
    if (existingCategory) {
      throw 'Name already exists';
    }
    const Category = await CategoryModel.create(category);
    return Category;
   
     }
      catch(err) {
         throw new HttpException(err, HttpStatus.FORBIDDEN)
      }
     }

  async updateCategory(id: number, category: Category) {
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
