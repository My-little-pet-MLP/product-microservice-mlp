import { ProductInOrderRepository } from "../product-in-order-repository";
import { ProductInOrders } from "@prisma/client";

// Definindo um tipo para representar o ProductInOrders in-memory
type InMemoryProductInOrders = {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
};

export class InMemoryProductInOrderRepository implements ProductInOrderRepository {
  private productsInOrder: InMemoryProductInOrders[] = [];

  // Simulação de ID aleatório
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Simulação de data atual
  private currentDate(): Date {
    return new Date();
  }

  async getByOrderAndProductId(orderId: string, productId: string): Promise<ProductInOrders | null> {
    const productInOrder = this.productsInOrder.find(
      (product) => product.orderId === orderId && product.productId === productId
    );
    return productInOrder || null;
  }

  async updateQuantity(
    orderId: string,
    productId: string,
    quantity: number
  ): Promise<InMemoryProductInOrders | null> {
    const productInOrder = await this.getByOrderAndProductId(orderId, productId);
  
    if (!productInOrder) return null;
  
    productInOrder.quantity += quantity;
    productInOrder.updated_at = this.currentDate();
  
    // Atualizar o array no repositório para refletir a mudança
    const index = this.productsInOrder.findIndex(
      (p) => p.orderId === orderId && p.productId === productId
    );
    if (index !== -1) {
      this.productsInOrder[index] = productInOrder; // Persistindo a alteração
    }
  
    return productInOrder;
  }

  async listAllByOrder(orderId: string): Promise<InMemoryProductInOrders[] | null> {
    const productsInOrder = this.productsInOrder.filter(
      (product) => product.orderId === orderId
    );
    return productsInOrder.length > 0 ? productsInOrder : null;
  }

  async findById(id: string): Promise<InMemoryProductInOrders | null> {
    const productInOrder = this.productsInOrder.find((product) => product.id === id);
    return productInOrder || null;
  }

  async register(data: { orderId: string; productId: string; quantity: number }): Promise<InMemoryProductInOrders> {
    const newProductInOrder: InMemoryProductInOrders = {
      id: this.generateId(),
      productId: data.productId,
      orderId: data.orderId,
      quantity: data.quantity,
      created_at: this.currentDate(),
      updated_at: this.currentDate(),
    };

    this.productsInOrder.push(newProductInOrder);
    return newProductInOrder;
  }

  async update(
    id: string,
     quantity?: number 
  ): Promise<InMemoryProductInOrders | null> {
    const productIndex = this.productsInOrder.findIndex((product) => product.id === id);
    if (productIndex === -1) return null;

    const updatedProduct = {
      ...this.productsInOrder[productIndex],
      quantity:quantity ?? this.productsInOrder[productIndex].quantity,
      updated_at: this.currentDate(),
    };

    this.productsInOrder[productIndex] = updatedProduct;
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    this.productsInOrder = this.productsInOrder.filter((product) => product.id !== id);
  }
}
