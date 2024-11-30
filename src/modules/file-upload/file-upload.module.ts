import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { ProductService } from '../product/product.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, ProductService],
})
export class FileUploadModule {}
