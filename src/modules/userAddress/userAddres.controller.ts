import { CurrentAccount } from 'src/guard/currentUser';
import { UserAddressService } from './userAddress.service';
import { Body, Controller } from '@nestjs/common';
import { UserAddress } from 'src/submodules/models/UserModel/User';

@Controller('userAddress')
export class UserAddressController {
    constructor(private readonly UserAddressService: UserAddressService) {}
    getAll(@CurrentAccount() account) {
        return this.UserAddressService.getListByUser(account.id);
    }
    createUserAddress(@CurrentAccount() account, @Body() props: UserAddress) {
        return this.UserAddressService.createUserAddress(account, props);
    }
    updateUserAddress(@CurrentAccount() account, @Body() props: UserAddress) {}
}
