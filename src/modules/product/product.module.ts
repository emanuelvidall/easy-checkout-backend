import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { PrismaModule } from 'prisma/prisma.module';
import { FileUploadService } from '../file-upload/file-upload.service';

@Module({
  imports: [PrismaModule],
  providers: [ProductResolver, ProductService, FileUploadService],
  exports: [ProductService],
})
export class ProductModule {}
