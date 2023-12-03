import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { ConfigDatabase } from './configs/config';
import { appConfig } from './constants/IConfig';
import { JwtAuthGuard } from './guard/jwtGuard';
import { JwtStrategy } from './guard/jwtStratery';
import { AccountController } from './modules/auth/auth.controller';
import { AccountService } from './modules/auth/auth.service';
import { CartController } from './modules/cart/Cart.controller';
import { CartService } from './modules/cart/Cart.service';
import { CategoryController } from './modules/category/category.controller';
import { CategoryService } from './modules/category/category.service';
import { DiscountController } from './modules/discount/discount.controller';
import { DiscountService } from './modules/discount/discount.service';
import { EmailModule } from './modules/email/email.module';
import { OtpController } from './modules/forgotPassword/forgot-password.controller';
import { OtpService } from './modules/forgotPassword/forgot-password.service';
import { NewService } from './modules/news/new.service';
import { NewsController } from './modules/news/news.controller';
import { OrderController } from './modules/order/order.controller';
import { OrderService } from './modules/order/order.service';
import { PaymentController } from './modules/payment/payment.controller';
import { PaymentService } from './modules/payment/payment.service';
import { ProducerController } from './modules/producer/producer.controller';
import { ProducerService } from './modules/producer/producer.service';
import { ProductController } from './modules/product/product.controller';
import { ProductService } from './modules/product/product.service';
import { ProvinceController } from './modules/province/province.controller';
import { ProvinceService } from './modules/province/province.service';
import { ChatModule } from './modules/socket/chat.module';
import { StatisticalController } from './modules/statistical/statistical.controller';
import { StatisticalService } from './modules/statistical/statistical.service';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { UserAddressController } from './modules/userAddress/userAddress.controller';
import { UserAddressService } from './modules/userAddress/userAddress.service';
import { VoucherController } from './modules/voucher/voucher.controller';
import { VoucherService } from './modules/voucher/voucher.service';
import { CommentController } from './modules/comment/comment.controller';
import { CommentService } from './modules/comment/comment.service';
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
            autoLoadModels: true,
            synchronize: true,
        }),
        JwtModule.register({
            secret: appConfig.jwt.secret || 'book@123',
        }),
        EmailModule,
        CacheModule.register({
            ttl: 30,
        }),
        // ChatModule,
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
        UserAddressController,
        CartController,
        NewsController,
        CommentController,
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
        UserAddressService,
        CartService,
        NewService,
        CommentService,
    ],
})
export class AppModule {}
