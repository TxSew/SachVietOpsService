import { CurrentAccount } from 'src/guard/currentUser';
import { UserAddressService } from './userAddress.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserAddress } from 'src/submodules/models/UserModel/User';

@Controller('userAddress')
export class UserAddressController {
    constructor(private readonly UserAddressService: UserAddressService) {}
    @Get('')
    getAll(@CurrentAccount() account) {
        return this.UserAddressService.getListByUser(account.id);
    }
    @Post('/createUserAddress')
    createUserAddress(@Body() props: UserAddress, @CurrentAccount() account) {
        return this.UserAddressService.createUserAddress(props, account.id);
    }
    @Post('/updateUserAddress')
    updateUserAddress(@CurrentAccount() account, @Body() props: UserAddress) {
        return this.UserAddressService.updateUserAddress(account.id, props);
    }
}
