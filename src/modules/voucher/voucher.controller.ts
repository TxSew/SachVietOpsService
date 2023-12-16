import { Body, Controller, Post } from '@nestjs/common';
import { CurrentAccount } from 'src/guard/currentUser';
import { Public } from 'src/guard/jwtGuard';
import { Voucher } from 'src/submodules/models/voucherModel/Voucher';
import { VoucherService } from './voucher.service';

@Controller('voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) {}

    @Post('')
    getVoucherByUser(@CurrentAccount() account) {
        return this.voucherService.getAllVoucherByUser(account.id);
    }

    @Post('/getVOucherUserIsNull')
    getVoucherByUserIsnull(@CurrentAccount() account) {
        return this.voucherService.getAllVoucherByUserIsNull(account.id);
    }

    @Post('/add-voucher')
    addVoucherUser(@Body() props: Voucher, @CurrentAccount() account) {
        return this.voucherService.addVoucherUser(props, account);
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
