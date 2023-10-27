import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "src/submodules/models/UserModel/User";
import { ApiTags } from "@nestjs/swagger";
import { serviceName } from "src/constants/IServiceName";
import { UserQueryDto } from "./dto/query-users";

@ApiTags("Users")
@Controller(serviceName.users)
export class UserController {
  constructor(private userService: UserService) {}
  @Get("")
  public GetUser(@Query() query: UserQueryDto) {
    return this.userService.getUsers(query);
  }
  @Get("CurrentUser")
  public GetUserCurrent(@Body() email: string): Promise<User> {
    return this.userService.getUserCurrent(email);
  }
}
