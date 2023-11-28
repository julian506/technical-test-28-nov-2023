import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { getOrderProductsByCustomerNumberAndDataRangesDto } from './dto/getOrderProductsByClientAndDateRanges.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/getOrderProductsByCustomerNumberAndDataRanges')
  getOrderProductsByCustomerNumberAndDataRanges(
    @Body() data: getOrderProductsByCustomerNumberAndDataRangesDto,
  ) {
    return this.appService.getOrderProductsByCustomerNumberAndDataRanges(data);
  }
}
