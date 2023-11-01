import { Controller, Get, Post, Param } from "@nestjs/common";
import { StatisticalService } from "./statistical.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Statistical")
@Controller("statistical")
export class StatisticalController {
  constructor(private statisticalService: StatisticalService) {}

  @Get("")
  public GetTotal(): Promise<any> {
    return this.statisticalService.getTotal();
  }

  @Get(":year/:month")
  GetRevenue(@Param("year") year: number, @Param("month") month: number) {
    return this.statisticalService.calculateProductRevenueByMonth(year, month);
  }

  @Get("/revenueToday")
  getStatisticalByDate(): Promise<any> {
    return this.statisticalService.getStatisticalToday();
  }
}
