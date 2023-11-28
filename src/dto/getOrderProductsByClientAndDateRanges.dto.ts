import { IsDateString, IsNumber } from 'class-validator';

export class getOrderProductsByCustomerNumberAndDataRangesDto {
  @IsNumber()
  customerNumber: number;
  @IsDateString()
  startDate: string;
  @IsDateString()
  endDate: string;
}
