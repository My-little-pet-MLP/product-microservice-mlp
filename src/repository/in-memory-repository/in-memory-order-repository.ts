import { OrderRepository } from "../order-repository";
import { Order, OrderStatus, Prisma } from "@prisma/client";

// Definindo um tipo para representar o pedido in-memory (similar ao Prisma.Order)
type InMemoryOrder = {
  id: string;
  fullPriceOrderInCents: number;
  storeId: string;
  status: OrderStatus;
  customerId: string;
  created_at: Date;
  updated_at: Date;
};

export class InMemoryOrderRepository implements OrderRepository {
  private orders: InMemoryOrder[] = [];

  // Simulação de ID aleatório (pode substituir por algo mais robusto como 'uuid')
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Simulação da data atual
  private currentDate(): Date {
    return new Date();
  }

  async listAllByStoreId(storeId: string, page: number, size: number): Promise<InMemoryOrder[] | null> {
    const skip = (page - 1) * size;
    const take = size;

    const filteredOrders = this.orders.filter(order => order.storeId === storeId);
    const paginatedOrders = filteredOrders.slice(skip, skip + take);
    
    return paginatedOrders.length > 0 ? paginatedOrders : null;
  }

  async confirmOrder(id: string, fullPriceOrderInCents: number): Promise<InMemoryOrder | null> {
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;

    this.orders[orderIndex].status = "payment_confirmed";
    this.orders[orderIndex].fullPriceOrderInCents = fullPriceOrderInCents;
    this.orders[orderIndex].updated_at = this.currentDate();

    return this.orders[orderIndex];
  }

  async verifyCustomerHavePedingOrder(customerId: string, storeId: string): Promise<InMemoryOrder | null> {
    const order = this.orders.find(
      order => order.customerId === customerId && order.storeId === storeId && order.status === "pending"
    );
    return order || null;
  }

  async countOrdersByCustomerId(customerId: string): Promise<number> {
    return this.orders.filter(order => order.customerId === customerId).length;
  }

  async countOrdersByStoreId(storeId: string): Promise<number> {
    return this.orders.filter(order => order.storeId === storeId).length;
  }

  async listAllByCustomerId(customerId: string, page: number, size: number): Promise<InMemoryOrder[] | null> {
    const skip = (page - 1) * size;
    const take = size;

    const filteredOrders = this.orders.filter(order => order.customerId === customerId);
    const paginatedOrders = filteredOrders.slice(skip, skip + take);
    
    return paginatedOrders.length > 0 ? paginatedOrders : null;
  }

  async getById(id: string): Promise<InMemoryOrder | null> {
    const order = this.orders.find(order => order.id === id);
    return order || null;
  }

  async register(data: Prisma.OrderUncheckedCreateInput): Promise<InMemoryOrder> {
    const newOrder: InMemoryOrder = {
      id: this.generateId(),
      fullPriceOrderInCents: data.fullPriceOrderInCents,
      storeId: data.storeId,
      status: data.status as OrderStatus,
      customerId: data.customerId,
      created_at: this.currentDate(),
      updated_at: this.currentDate(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  async update(id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<InMemoryOrder | null> {
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;

    // Atualize cada campo, verificando se o valor é uma operação de atualização ou um valor direto
    const updatedOrder = {
      ...this.orders[orderIndex],
      id: typeof data.id === 'string' ? data.id : this.orders[orderIndex].id,
      fullPriceOrderInCents: typeof data.fullPriceOrderInCents === 'number' ? data.fullPriceOrderInCents : this.orders[orderIndex].fullPriceOrderInCents,
      storeId: typeof data.storeId === 'string' ? data.storeId : this.orders[orderIndex].storeId,
      status: typeof data.status === 'string' ? data.status as OrderStatus : this.orders[orderIndex].status,
      customerId: typeof data.customerId === 'string' ? data.customerId : this.orders[orderIndex].customerId,
      updated_at: this.currentDate(),
    };

    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }
}
