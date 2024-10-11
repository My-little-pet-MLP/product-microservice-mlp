import { ProductRepostory } from "../product-repository";
import { Product } from "@prisma/client";

// Definindo um tipo para representar o Product in-memory
type InMemoryProduct = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  priceInCents: number;
  stock: number;
  categoryId: string;
  storeId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class InMemoryProductRepository implements ProductRepostory {
  private products: InMemoryProduct[] = [];

  // Simulação de ID aleatório
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Simulação da data atual
  private currentDate(): Date {
    return new Date();
  }

  async verifyIsActive(id: string): Promise<InMemoryProduct | null> {
    const product = this.products.find(product => product.id === id && product.isActive);
    return product || null;
  }

  async updateStock(id: string, stock: number): Promise<InMemoryProduct | null> {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) return null;

    this.products[productIndex].stock = stock;
    this.products[productIndex].updatedAt = this.currentDate();

    return this.products[productIndex];
  }

  async delete(id: string): Promise<void> {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      this.products[productIndex].isActive = false;
      this.products[productIndex].updatedAt = this.currentDate();
    }
  }

  async countProductsByStoreId(storeId: string): Promise<number> {
    return this.products.filter(product => product.storeId === storeId && product.isActive).length;
  }

  async countProductsByCategoryId(categoryId: string): Promise<number> {
    return this.products.filter(product => product.categoryId === categoryId && product.isActive).length;
  }

  async update(id: string, data: {
    title: string;
    slug: string;
    imageUrl: string;
    description: string;
    priceInCents: number;
    stock: number;
    categoryId: string;
  }): Promise<InMemoryProduct> {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    // Atualizando o produto com os novos dados
    const updatedProduct: InMemoryProduct = {
      ...this.products[productIndex],
      ...data, // Atribui os novos valores
      updatedAt: this.currentDate(), // Atualiza o campo updatedAt
    };

    this.products[productIndex] = updatedProduct;

    // Retorna o produto atualizado (que agora corresponde ao tipo completo esperado)
    return updatedProduct;
  }

  async listProductByCategoryId(categoryId: string, page: number, size: number): Promise<InMemoryProduct[]> {
    const skip = (page - 1) * size;

    return this.products
      .filter(product => product.categoryId === categoryId && product.isActive)
      .slice(skip, skip + size);
  }

  async getById(id: string): Promise<InMemoryProduct | null> {
    const product = this.products.find(product => product.id === id);
    return product || null;
  }

  async listProductsByStoreId(storeId: string, page: number, size: number): Promise<InMemoryProduct[]> {
    const skip = (page - 1) * size;

    return this.products
      .filter(product => product.storeId === storeId && product.isActive)
      .slice(skip, skip + size);
  }

  async register(data: Omit<InMemoryProduct, "id" | "createdAt" | "updatedAt">): Promise<InMemoryProduct> {
    const newProduct: InMemoryProduct = {
      id: this.generateId(),
      createdAt: this.currentDate(),
      updatedAt: this.currentDate(),
      ...data,
    };

    this.products.push(newProduct);
    return newProduct;
  }
}
