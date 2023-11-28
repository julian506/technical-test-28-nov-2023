import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OrderAndProduct } from './interfaces/orderAndProducts.interface';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrderProductsByCustomerNumberAndDataRanges({
    customerNumber,
    startDate,
    endDate,
  }): Promise<object> {
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);

    if (startDateObject > endDateObject) {
      throw new HttpException(
        'Error. Start date must be earlier than end date.',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const customer = await this.prisma.customers.findFirst({
      where: {
        customer_number: customerNumber,
      },
    });

    if (!customer) {
      throw new HttpException(
        `There's not a customer with the sent customer number`,
        HttpStatus.NOT_FOUND,
      );
    }

    const ordersAndProducts: OrderAndProduct[] = await this.prisma.$queryRaw`
      SELECT x.order_number, w.product_name
      FROM public.orders x
      JOIN orderdetails y ON x.order_number = y.order_number
      JOIN products w ON y.product_code = w.product_code
      WHERE x.order_date BETWEEN ${startDateObject} AND ${endDateObject}
      AND x.customer_number = ${customerNumber}
      ORDER BY x.order_number;
    `;

    const result = {};
    ordersAndProducts.forEach((element) => {
      if (element.order_number in result) {
        result[element.order_number].push(element.product_name);
      } else {
        result[element.order_number] = [element.product_name];
      }
    });


    return result;
  }
}
