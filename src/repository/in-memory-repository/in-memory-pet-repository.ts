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

  async update(id: string, data: Prisma.PetUncheckedUpdateInput): Promise<Pet | null> {
    const petIndex = this.pets.findIndex(pet => pet.id === id);
    if (petIndex === -1) return null;

    const existingPet = this.pets[petIndex];

    // Extração de valores primitivos, ignorando operações de atualização
    const updatedPet: Pet = {
      ...existingPet,
      name: typeof data.name === "string" ? data.name : existingPet.name,
      breed: typeof data.breed === "string" ? data.breed : existingPet.breed,
      age: typeof data.age === "number" ? data.age : existingPet.age,
      imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : existingPet.imageUrl,
      size: data.size as any || existingPet.size,
      customerId: typeof data.customerId === "string" ? data.customerId : existingPet.customerId,
      isActive: typeof data.isActive === "boolean" ? data.isActive : existingPet.isActive,
    };

    this.pets[petIndex] = updatedPet;
    return updatedPet;
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

  clear(): void {
    this.pets = [];
  }
}
