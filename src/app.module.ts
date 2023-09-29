import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './modules/Auth/auth.controller';
import { AccountService } from './modules/Auth/auth.service';
import { CategoryController } from './modules/Category/category.controller';
import { CategoryService } from './modules/Category/category.service';
import { DiscountController } from './modules/Discount/discount.controller';
import { DiscountService } from './modules/Discount/discount.service';
import { OrderController } from './modules/Order/order.controller';
import { OrderService } from './modules/Order/order.service';
import { ProducerController } from './modules/Producer/producer.controller';
import { producerService } from './modules/Producer/producer.service';
import { ProductController } from './modules/Product/product.controller';
import { ProductService } from './modules/Product/product.service';
import { StatisticalController } from './modules/Statistical/statistical.controller';
import { StatisticalService } from './modules/Statistical/statistical.service';
import { UserController } from './modules/User/user.controller';
import { UserService } from './modules/User/user.service';
import { ProvinceController } from './modules/Province/province.controller';
import { ProvinceService } from './modules/Province/province.service';
import { EmailModule } from './modules/email/email.module';
import { ConfigDatabase } from './configs/config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: ConfigDatabase.development.host,
      port: 3306,
      username: ConfigDatabase.development.username,
      password: '',
      database: ConfigDatabase.development.database,
      autoLoadModels: true, // Automatically load models from the 'models' folder
      synchronize: true, // Auto-create and update database tables (not recommended for production)
    }),
    JwtModule.register({
      secret: process.env.JWT_ExpiresIn,
      signOptions: { expiresIn: '1d' },
    }),
    EmailModule,
  ],
  controllers: [
    AppController,
    AccountController,
    ProductController,
    CategoryController,
    ProducerController,
    OrderController,
    StatisticalController,
    UserController,
    DiscountController,
    ProvinceController,
  ],
  providers: [
    AppService,
    AccountService,
    ProductService,
    CategoryService,
    producerService,
    OrderService,
    StatisticalService,
    UserService,
    DiscountService,
    ProvinceService,
  ],
})
export class AppModule {}
