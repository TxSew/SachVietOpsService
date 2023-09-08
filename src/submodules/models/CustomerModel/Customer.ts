import { Model } from 'sequelize';

export interface Customer {
  id?: string;
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  status?: string;
  trash?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
