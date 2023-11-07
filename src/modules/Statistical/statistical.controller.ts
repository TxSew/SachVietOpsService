import { Controller, Get, Post, Param } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/guard/jwtGuard';

@ApiTags('Statistical')
@Controller('statistical')
export class StatisticalController {
    constructor(private statisticalService: StatisticalService) {}

    @Public()
    @Get('')
    public GetTotal(): Promise<any> {
        return this.statisticalService.getTotal();
    }

    @Public()
    @Get(':year/:month')
    GetRevenue(@Param('year') year: number, @Param('month') month: number) {
        return this.statisticalService.calculateProductRevenueByMonth(year, month);
    }

    @Public()
    @Get('/revenueToday')
    getStatisticalByDate(): Promise<any> {
        return this.statisticalService.getStatisticalToday();
    }
}
