import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "src/submodules/models/UserModel/User";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}
  @Get("")
  public GetUser(@Query() query: any) {
    return this.userService.getUsers(query);
  }
  @Get("CurrentUser")
  public GetUserCurrent(@Body() email: string): Promise<User> {
    return this.userService.getUserCurrent(email);
  }
}
