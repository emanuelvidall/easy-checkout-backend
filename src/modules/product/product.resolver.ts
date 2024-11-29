import { Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.model';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async getProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }
}
