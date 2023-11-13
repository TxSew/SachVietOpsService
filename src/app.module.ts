import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { ConfigDatabase } from './configs/config';
import { appConfig } from './constants/IConfig';
import { JwtAuthGuard } from './guard/jwtGuard';
import { JwtStrategy } from './guard/jwtStratery';
import { AccountController } from './modules/Auth/auth.controller';
import { AccountService } from './modules/Auth/auth.service';
import { CategoryController } from './modules/Category/category.controller';
import { CategoryService } from './modules/Category/category.service';
import { DiscountController } from './modules/Discount/discount.controller';
import { DiscountService } from './modules/Discount/discount.service';
import { OrderController } from './modules/Order/order.controller';
import { OrderService } from './modules/Order/order.service';
import { ProducerController } from './modules/Producer/producer.controller';
import { ProducerService } from './modules/Producer/producer.service';
import { ProductController } from './modules/Product/product.controller';
import { ProductService } from './modules/Product/product.service';
import { ProvinceController } from './modules/Province/province.controller';
import { ProvinceService } from './modules/Province/province.service';
import { StatisticalController } from './modules/Statistical/statistical.controller';
import { StatisticalService } from './modules/Statistical/statistical.service';
import { UserController } from './modules/User/user.controller';
import { UserService } from './modules/User/user.service';
import { EmailModule } from './modules/email/email.module';
import { OtpController } from './modules/forgotPassword/forgot-password.controller';
import { OtpService } from './modules/forgotPassword/forgot-password.service';
import { PaymentController } from './modules/payment/payment.controller';
import { PaymentService } from './modules/payment/payment.service';
import { VoucherService } from './modules/voucher/voucher.service';
import { VoucherController } from './modules/voucher/voucher.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
dotenv.config();
@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: ConfigDatabase.development.host,
            port: 3306,
            username: ConfigDatabase.development.username,
            password: ConfigDatabase.development.password,
            database: ConfigDatabase.development.database,
            autoLoadModels: true, // Automatically load models from the 'models' folder
            synchronize: true, // Auto-create and update database tables (not recommended for production)
        }),
        JwtModule.register({
            secret: appConfig.jwt.secret || 'book@123',
            signOptions: { expiresIn: '1d' },
        }),
        EmailModule,
        CacheModule.register({
            ttl: 30,
        }),
    ],
    controllers: [
        AccountController,
        ProductController,
        CategoryController,
        ProducerController,
        OrderController,
        StatisticalController,
        UserController,
        DiscountController,
        ProvinceController,
        OtpController,
        PaymentController,
        VoucherController,
    ],

    providers: [
        JwtAuthGuard,
        JwtStrategy,
        { provide: 'APP_GUARD', useClass: JwtAuthGuard },

        AccountService,
        ProductService,
        CategoryService,
        ProducerService,
        OrderService,
        StatisticalService,
        UserService,
        DiscountService,
        ProvinceService,
        OtpService,
        PaymentService,
        VoucherService,
    ],
})
export class AppModule {}
