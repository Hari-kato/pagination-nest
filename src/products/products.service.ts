import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.scehma';

@Injectable()
export class ProductsService {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

  // Limit-Offset Pagination
  async getLimitOffsetPagination(limit: number, offset: number) {
    const data = await this.productModel
      .find()
      .sort({ createdAt: 1 }) // Sort by createdAt in ascending order
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.productModel.countDocuments().exec();

    return {
      data,
      total,
      limit,
      offset,
    };
  }

  // Cursor-Based Pagination
  private encodeCursor(cursor: string): string {
    return Buffer.from(cursor, 'utf-8').toString('base64');
  }

  private decodeCursor(encodedCursor: string): string {
    return Buffer.from(encodedCursor, 'base64').toString('utf-8');
  }

  async getCursorPagination(limit: number, encodedCursor: string = null) {
    const cursor = encodedCursor ? this.decodeCursor(encodedCursor) : null;

    const query = cursor ? { _id: { $gt: cursor } } : {};

    const data = await this.productModel
      .find(query)
      .sort({ _id: 1 }) // Sort by _id in ascending order
      .limit(limit)
      .exec();

    const nextCursor = data.length ? this.encodeCursor(data[data.length - 1]._id.toString()) : null;

    // Calculate remaining count
    const remaining = await this.productModel.countDocuments({
      ...query,
      _id: { $gt: data.length ? data[data.length - 1]._id : cursor },
    });

    return {
      data,
      nextCursor,
      limit,
      remaining,
    };
  }

}
