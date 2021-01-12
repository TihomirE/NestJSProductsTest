/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    async addProduct(
        @Body('title') prodTitle: string,
        @Body('description') prodDescr: string,
        @Body('price') prodPrice: number,
    ) {
        const generatedId = await this.productsService.insertProduct(
            prodTitle,
            prodDescr,
            prodPrice,
        );
        return { id: generatedId };
    }

    @Get()
    async getAllProducts() {
        const products = await this.productsService.getAllProducts();
        return products;
    }

    @Get(':id')
    async getProduct(@Param('id') prodId: string) {
        return await this.productsService.getProduct(prodId);
    }

    @Patch(':id')
    async updateProduct(@Param('id') prodId: string, @Body('title') prodTitle: string, @Body('description') prodDesc: string, @Body('price') prodPrice: number) {
        return await this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
    }

    @Delete(':id')
    async removeProduct(@Param('id') prodId: string) {
        const deleted = await this.productsService.deleteProduct(prodId);
        return deleted; // return deleted product or true ?
    }
}
