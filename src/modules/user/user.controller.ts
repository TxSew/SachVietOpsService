import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/submodules/models/UserModel/User';
import { ApiTags } from '@nestjs/swagger';
import { serviceName } from 'src/constants/IServiceName';
import { UserQueryDto } from './dto/query-users';
import { Public } from 'src/guard/jwtGuard';
import { CurrentAccount } from 'src/guard/currentUser';

@ApiTags('Users')
@Controller(serviceName.users)
export class UserController {
    constructor(private userService: UserService) {}
    @Public()
    @Get('')
    public GetUser(@Query() query: UserQueryDto) {
        return this.userService.getUsers(query);
    }

    @Public()
    @Get('CurrentUser')
    public getUserCurrent(@Body() email: string): Promise<User> {
        return this.userService.getUserCurrent(email);
    }

    @Get('getMe')
    getMe(@CurrentAccount() account) {
        return this.userService.getMe(account.id);
    }
}
