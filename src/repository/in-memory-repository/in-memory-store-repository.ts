import { StoreRepository } from "../store-repository";
import { Store } from "@prisma/client";

type InMemoryStore = {
  id: string;
  title: string;
  description: string;
  cnpj: string;
  userId: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class InMemoryStoreRepository implements StoreRepository {
  private stores: InMemoryStore[] = [];

  // Simulação de ID aleatório (você pode usar uma lib como 'uuid' se quiser IDs reais)
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Simulação da data atual para createdAt/updatedAt
  private currentDate(): Date {
    return new Date();
  }

  async findById(id: string): Promise<Store | null> {
    const store = this.stores.find(store => store.id === id);
    return store || null;
  }

  async findStoreByUserId(userId: string): Promise<Store | null> {
    const store = this.stores.find(store => store.userId === userId);
    return store || null;
  }

  async register(title: string, description: string, cnpj: string, userId: string, imageUrl: string): Promise<Store> {
    const newStore: InMemoryStore = {
      id: this.generateId(),
      title,
      description,
      cnpj,
      userId,
      imageUrl,
      isActive: true,
      createdAt: this.currentDate(),
      updatedAt: this.currentDate(),
    };

    this.stores.push(newStore);
    return newStore;
  }

  async update(id: string, data: { cnpj: string, imageUrl: string, description: string, title: string }): Promise<Store | null> {
    const storeIndex = this.stores.findIndex(store => store.id === id);
    if (storeIndex === -1) return null;

    const updatedStore = {
      ...this.stores[storeIndex],
      ...data,
      updatedAt: this.currentDate(),
    };

    this.stores[storeIndex] = updatedStore;
    return updatedStore;
  }

  async delete(id: string): Promise<void> {
    const storeIndex = this.stores.findIndex(store => store.id === id);
    if (storeIndex !== -1) {
      this.stores[storeIndex].isActive = false;
      this.stores[storeIndex].updatedAt = this.currentDate();
    }
  }

  async reactivate(id: string): Promise<Store> {
    const storeIndex = this.stores.findIndex(store => store.id === id);
    if (storeIndex === -1) throw new Error("Store not found");

    this.stores[storeIndex].isActive = true;
    this.stores[storeIndex].updatedAt = this.currentDate();

    return this.stores[storeIndex];
  }

  async getRandomStore(): Promise<Store | null> {
    if (this.stores.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * this.stores.length);
    return this.stores[randomIndex];
  }
}
