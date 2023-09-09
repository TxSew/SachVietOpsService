import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerService } from './auth.service';
import { Models } from './auth.schema';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/submodules/models/UserModel/User';
@ApiTags('Auth')
@Controller('auth')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('')
  getAll(): Promise<Models[]> {
    return this.customerService.getAll();
  }

  @Post('register')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiCreatedResponse({ description: 'The cat has been successfully created.' })
  create(@Body() data: User): Promise<User> {
    return this.customerService.register(data);
  }
  @Post('Login')
  @ApiOperation({ summary: 'check login account' })
  @ApiCreatedResponse({ description: ' checkLogin successfully.' })
  Login(@Body() data: User): Promise<User> {
    return this.customerService.checkLogin(data);
  }
}
