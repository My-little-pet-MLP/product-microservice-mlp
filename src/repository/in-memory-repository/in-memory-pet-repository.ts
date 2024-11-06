import { Pet, Prisma } from "@prisma/client";
import { PetRepository } from "../pet-repository";

export class InMemoryPetRepository implements PetRepository {
  private pets: Pet[] = [];

  async findById(id: string): Promise<Pet | null> {
    return this.pets.find(pet => pet.id === id) || null;
  }

  async register(data: Prisma.PetUncheckedCreateInput & { id?: string }): Promise<Pet> {
    const newPet: Pet = {
      id: data.id || `${Math.random()}`, // Geração de ID manual ou automática
      name: data.name,
      breed: data.breed,
      age: data.age,
      imageUrl: data.imageUrl,
      size: data.size as any, // Casting para o tipo correto do enum
      customerId: data.customerId,
      isActive: true,
    };
    this.pets.push(newPet);
    return newPet;
  }

  async delete(id: string): Promise<void> {
    const pet = this.pets.find(p => p.id === id);
    if (pet) {
      pet.isActive = false;
    }
  }

  async listAllByUserId(customerId: string): Promise<Pet[]> {
    return this.pets.filter(pet => pet.customerId === customerId && pet.isActive === true);
  }

  // Método para limpar o repositório entre os testes
  clear(): void {
    this.pets = [];
  }
}
