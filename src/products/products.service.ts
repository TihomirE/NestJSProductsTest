/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
    private products: Product[] = [];

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    async insertProduct(title: string, description: string, price: number) {
        const newProduct = new this.productModel({
            title, description, price,
        });
        const result = await newProduct.save();
        console.log(result);
        return result;
    }

    async getAllProducts() {
        // returning the copy of the array to avoid editing
        // return [...this.products];

        const products = await this.productModel.find().exec();
        return products.map(prod => ({
            id: prod.id,
            title: prod.title,
            description: prod.description,
            price: prod.price
        }));
    }

    async getProduct(productId: string) {
        const product = await this.findProduct(productId);
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price
        };
    }

    async updateProduct(productId: string, title: string, description: string, price: number) {
        const updatedProduct = await this.findProduct(productId);
        if (title) {
            updatedProduct.title = title;
        }
        if (description) {
            updatedProduct.description = description;
        }
        if (price) {
            updatedProduct.price = price;
        }
        updatedProduct.save();
        return updatedProduct;
    }

    async deleteProduct(prodId: string) {
        const result = await this.productModel.deleteOne({_id: prodId}).exec();
        if (result.n === 0) {
            throw new NotFoundException('Could not find product.');
        }
        return true;
    }

    private async findProduct(id: string): Promise<Product> {
        let product: Product;
        try {
            product = await this.productModel.findById(id).exec();
        } catch (error) {
            throw new NotFoundException('Could not find product');
        }
        if (!product) {
            throw new NotFoundException('Could not find product');
        }
        return product;
    }
}
