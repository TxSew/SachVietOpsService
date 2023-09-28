import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/submodules/models/UserModel/User';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('')
  async GetUser(@Query() query: any) {
    return this.userService.getUsers(query);
  }
  @Get('CurrentUser')
  async GetUserCurrent(@Param('id') id: number): Promise<User> {
    return this.userService.getUserCurrent(id);
  }
  @Put('updateUser')
  async UpdateUserCurrent(
    @Param('id') id: number,
    userCurrent: User,
  ): Promise<any> {
    return this.UpdateUserCurrent(Number(id), userCurrent);
  }
}
