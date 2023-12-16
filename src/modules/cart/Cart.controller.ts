import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentAccount } from 'src/guard/currentUser';
import { CartService } from './Cart.service';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}
    @Get('')
    getListCart(@CurrentAccount() account) {
        return this.cartService.getCart(account.id);
    }

    @Post('addToCart')
    addToCart(@Body() props: any, @CurrentAccount() account) {
        return this.cartService.addToCart(props, account.id);
    }
}
