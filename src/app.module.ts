import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerController } from './modules/Auth/auth.controller';
import { CustomerService } from './modules/Auth/auth.service';
import { CustomerModel } from './modules/Auth/auth.schema';
import { ProductController } from './modules/Product/product.controller';
import { ProductService } from './modules/Product/product.service';
import { CategoryController } from './modules/Category/category.controller';
import { CategoryService } from './modules/Category/category.service';
import { ProducerController } from './modules/Producer/producer.controller';
import { producerService } from './modules/Producer/producer.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'db_shop',
      autoLoadModels: true, // Automatically load models from the 'models' folder
      synchronize: true, // Auto-create and update database tables (not recommended for production)
    }),
  ],
  controllers: [
    AppController,
    CustomerController,
    ProductController,
    CategoryController,
    ProducerController,
  ],
  providers: [
    AppService,
    CustomerService,
    ProductService,
    CategoryService,
    producerService,
  ],
})
export class AppModule {}
