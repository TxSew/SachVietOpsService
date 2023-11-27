import { Body, Controller, Post } from '@nestjs/common';
import { CurrentAccount } from 'src/guard/currentUser';
import { Public } from 'src/guard/jwtGuard';
import { Voucher } from 'src/submodules/models/voucherModel/Voucher';
import { VoucherService } from './voucher.service';

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

    @Post('/getVoucher')
    getOneDiscount(@CurrentAccount() account, @Body() order) {
        return this.voucherService.getOneDiscount(account, order);
    }

    @Public()
    @Post('/remove-voucher')
    deleteVoucherByUser(@Body() props: { id: Partial<number> }) {
        return this.voucherService.deleteVoucherUser(props);
    }
}
