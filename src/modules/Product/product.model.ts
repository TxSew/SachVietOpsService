// src/product/product.model.ts
import { Model, Column, Table } from 'sequelize-typescript';

@Table
export class Product extends Model<Product> {
  @Column
  name: string;

  @Column
  description: string;

  @Column
  price: number;
}
