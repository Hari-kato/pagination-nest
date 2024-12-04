import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('offset')
  async getLimitOffsetPagination(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.productsService.getLimitOffsetPagination(+limit, +offset);
  }

  @Get('cursor')
  async getCursorPagination(
    @Query('limit') limit: number = 10,
    @Query('cursor') cursor?: string,
  ) {
    return this.productsService.getCursorPagination(+limit, cursor);
  }
}
