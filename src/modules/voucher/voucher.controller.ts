import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/guard/jwtGuard';
import { VoucherService } from './voucher.service';
import { Voucher } from 'src/submodules/models/voucherModel/Voucher';

@Controller('voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) {}

    @Public()
    @Post('')
    getVoucherByUser(@Body() props: { userId: number }) {
        return this.voucherService.getAllVoucherByUser(props);
    }

    @Public()
    @Post('add-voucher')
    addVoucherUser(@Body() props: Voucher) {
        return this.voucherService.addVoucherUser(props);
    }
}
