import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from 'src/submodules/models/UserModel/User';
import { Models } from './auth.schema';
import { AccountService } from './auth.service';
import { LoginRequestDTO } from './dto/loginRequest.dto';
@ApiTags('Auth')
@Controller('auth')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('')
  getAll(): Promise<Models[]> {
    return this.accountService.getAll();
  }
   @Get('current')
     getCurrent( @Res() result: Request) {
       this.accountService.getCurrent(result) 
     }

  @Post('register')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiCreatedResponse({ description: 'The cat has been successfully created.' })
  create(@Body() data: User): Promise<User> {
    return this.accountService.register(data);
  }
  @Post('Login')
  @ApiOperation({ summary: 'check login account' })
  @ApiCreatedResponse({ description: ' checkLogin successfully.' })
  Login(@Body() data: LoginRequestDTO , @Res({passthrough:true}) response:Response) {
    return this.accountService.checkLogin(data, response);
  }
}
