import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CreateProductInput } from './create-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async getProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  //Example query to get all products:
  //   query {
  //   getProducts {
  //     id
  //     name
  //     description
  //     price
  //     imageURL
  //     createdAt
  //   }
  // }

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productService.createProduct(createProductInput);
  }

  //Example of mutation to create a product:
  //   mutation {
  //   createProduct(
  //     createProductInput: {
  //       name: "Smartphone"
  //       description: "A high-end smartphone"
  //       price: 999.99
  //       imageURL: "http://example.com/smartphone.jpg"
  //     }
  //   ) {
  //     id
  //     name
  //     description
  //     price
  //     imageURL
  //     createdAt
  //   }
  // }

  @Query(() => Product)
  async getProductById(@Args('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  // Example of query to get a product by ID:
  // query {
  // getProductById(id: "83a3f0e6-dce0-4ff5-9fc6-0abd9eb7a36a") {
  //   id
  //   name
  //   description
  //   price
  //   createdAt
  // }
  // }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id') id: string,
    @Args('updateProductInput') updateProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductInput);
  }

  //Example of a mutation to update a product:
  //   mutation {
  //   updateProduct(
  //     id: "83a3f0e6-dce0-4ff5-9fc6-0abd9eb7a36a"
  //     updateProductInput: {
  //       name: "Updated Smartphone"
  //       description: "An updated high-end smartphone"
  //       price: 899.99
  //       imageURL: "http://example.com/updated-smartphone.jpg"
  //     }
  //   ) {
  //     id
  //     name
  //     description
  //     price
  //     imageURL
  //     createdAt
  //   }
  // }

  @Mutation(() => Boolean, { name: 'deleteProduct' })
  async deleteProduct(@Args('productId') productId: string): Promise<boolean> {
    await this.productService.deleteProduct(productId);
    return true;
  }

  //Example of mutation to delete product:
  //   mutation {
  //   deleteProduct(id: "83a3f0e6-dce0-4ff5-9fc6-0abd9eb7a36a") {
  //     id
  //     name
  //     description
  //     price
  //     createdAt
  //   }
  // }
}
