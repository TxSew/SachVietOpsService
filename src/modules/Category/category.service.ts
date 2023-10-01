import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { CategoryModel } from './category.schema';
import { Category } from 'src/submodules/models/ProductModel/Category';

@Injectable()
export class CategoryService {
  async getAll() {
    const query = `
    WITH RECURSIVE CategoryTree AS (
      SELECT id, parentId, name, slug, image
      FROM db_category
      WHERE id = 1
      UNION ALL
      SELECT c.id, c.parentId, c.name, c.slug, c.image
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
  async getListCategory() {
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
  async getOne(id): Promise<any> {
    const Id: number = id.id;
    const findOne = await CategoryModel.findOne({
      where: {
        id: Id,
      },
    });
    if (findOne) {
      return findOne;
    }
  }
  //category

  async createCategory(category: Partial<Category>): Promise<any> {
    console.log(category);
    try {
      const existingCategory = await CategoryModel.findOne({
        where: { name: category.name },
      });
      if (existingCategory) {
        throw 'Name already exists';
      }
      const Category = await CategoryModel.create(category);
      return Category;
    } catch (err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }

  async updateCategory(id: number, category: Category) {
    console.log(id);
    console.log(category);
    const update = await CategoryModel.update(category, {
      where: { id: id },
    });
    return update;
  }
  async removeCategoryTrashed(id: number) {
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
