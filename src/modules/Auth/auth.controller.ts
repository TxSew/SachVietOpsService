import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerService } from './auth.service';

import { Customer } from 'src/models/CustomerModel/Customer';

@Controller('auth')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  getAll(): Promise<Customer[]> {
    return this.customerService.getAll();
  }
}
