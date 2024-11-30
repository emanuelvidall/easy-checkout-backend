import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from '../product/product.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Controller('upload')
export class FileUploadController {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  constructor(private readonly productService: ProductService) {}

  @Post('product-image')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }), // 10 MB
  )
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('productId') productId: string,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('File is required!');
    }

    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    const fileKey = `${uuidv4()}-${file.originalname}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );

      const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

      await this.productService.updateProductImage(productId, url);

      return { url };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new BadRequestException('File upload failed');
    }
  }
}
