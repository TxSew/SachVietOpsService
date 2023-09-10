import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './modules/Auth/auth.controller';
import { AccountService } from './modules/Auth/auth.service';
import { CategoryController } from './modules/Category/category.controller';
import { CategoryService } from './modules/Category/category.service';
import { ProducerController } from './modules/Producer/producer.controller';
import { producerService } from './modules/Producer/producer.service';
import { ProductController } from './modules/Product/product.controller';
import { ProductService } from './modules/Product/product.service';


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
     JwtModule.register({
      secret: process.env.JWT_ExpiresIn,
      signOptions: {expiresIn: '1d'}
     })
  ],
  controllers: [
    AppController,
    AccountController,
    ProductController,
    CategoryController,
    ProducerController,
  ],
  providers: [
    AppService,
    AccountService,
    ProductService,
    CategoryService,
    producerService,
  ],
})
export class AppModule {}
