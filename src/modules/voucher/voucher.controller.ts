import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/guard/jwtGuard';
import { VoucherService } from './voucher.service';
import { Voucher } from 'src/submodules/models/voucherModel/Voucher';
import { CurrentAccount } from 'src/guard/currentUser';

@Controller('voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) {}

    @Public()
    @Post('')
    getVoucherByUser(@Body() props: { userId: number }) {
        return this.voucherService.getAllVoucherByUser(props);
    }

    @Public()
    @Post('/add-voucher')
    addVoucherUser(@Body() props: Voucher) {
        return this.voucherService.addVoucherUser(props);
    }

    @Public()
    @Post('/getVoucher')
    getOneDiscount(@CurrentAccount() account, @Body() voucher) {
        return this.voucherService.getOneDiscount(account, voucher.voucher);
    }
    @Public()
    @Post('/remove-voucher')
    deleteVoucherByUser(@Body() props: { id: Partial<number> }) {
        return this.voucherService.deleteVoucherUser(props);
    }
}
