import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


export type ProductDocument = Product & Document;

@Schema({ toJSON: { virtuals: true }, timestamps: true, strict: true })
export class Product {
    @Prop({required:true})
    name:string

    @Prop({required:true})
    price: number;

    
}
export const ProductSchema = SchemaFactory.createForClass(Product);
