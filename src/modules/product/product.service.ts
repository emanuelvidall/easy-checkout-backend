import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async getProductById(id: string): Promise<Product> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async updateProduct(
    id: string,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  async updateProductImage(productId: string, imageURL: string): Promise<void> {
    await this.prisma.product.update({
      where: { id: productId },
      data: { imageURL: imageURL },
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const fileKey = product.imageURL.split('/').pop();

    await this.prisma.product.delete({
      where: { id: productId },
    });

    if (fileKey) {
      await this.fileUploadService.deleteFileFromS3(fileKey);
    }
  }
}
