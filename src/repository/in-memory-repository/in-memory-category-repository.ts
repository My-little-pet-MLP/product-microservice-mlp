import { Category, Prisma } from "@prisma/client";
import { CategoryRepository } from "../category-repository";

// Definindo um tipo para representar a Category in-memory (similar ao Prisma.Category)
type InMemoryCategory = {
  id: string;
  title: string;
  slug: string;
};

export class InMemoryCategoryRepository implements CategoryRepository {
  private categories: InMemoryCategory[] = [];

  // Retorna uma categoria pelo ID
  async getById(id: string): Promise<InMemoryCategory | null> {
    const category = this.categories.find(category => category.id === id);
    return category || null;
  }

  // Registra uma nova categoria
  async register(data: Prisma.CategoryUncheckedCreateInput): Promise<InMemoryCategory> {
    const newCategory: InMemoryCategory = {
      id: Math.random().toString(36).substring(2), // Gera um ID simples aleatório para simulação
      title: data.title,
      slug: data.slug,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  // Retorna todas as categorias
  async listAll(): Promise<InMemoryCategory[]> {
    return this.categories;
  }

  // Retorna uma categoria aleatória
  async SortRandomCategory(): Promise<InMemoryCategory | null> {
    if (this.categories.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.categories.length);
    return this.categories[randomIndex] || null;
  }
}