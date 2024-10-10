import { Prisma, Store } from "@prisma/client";
import { StoreRepository } from "../store-repository";
import { prisma } from "../../lib/prisma";

export class StoreRepositoryPrisma implements StoreRepository {
    async getRandomStore(): Promise<Store | null> {
        const count = await prisma.store.count(); // Conta o número total de lojas

        if (count === 0) {
            return null; // Se não houver lojas, retorna null
        }

        const randomIndex = Math.floor(Math.random() * count); // Gera um índice aleatório

        const store = await prisma.store.findMany({
            skip: randomIndex, // Pula até o índice aleatório
            take: 1, // Pega uma loja
        });

        return store[0]; // Retorna a loja ou null
    }
    async reactivate(id: string): Promise<Store> {
        const store = await prisma.store.update(
            {
                where: {
                    id,
                },
                data: {
                    isActive: true
                }
            }
        )
        return store;
    }
    async delete(id: string): Promise<void> {
        const store = await prisma.store.update(
            {
                where: {
                    id,
                },
                data: {
                    isActive: false
                }
            }
        )
        return
    }

    async findById(id: string): Promise<Store | null> {
        const store = await prisma.store.findFirst({
            where: {
                id
            }
        })
        return store;
    }
    async findStoreByUserId(userId: string): Promise<Store | null> {
        const store = await prisma.store.findFirst({
            where: {
                userId
            }
        })
        return store;
    }
    async register(title: string, description: string, cnpj: string, userId: string, imageUrl: string): Promise<Store> {
        const storeRegister = await prisma.store.create({
            data: {
                title,
                description,
                cnpj,
                userId,
                imageUrl
            }
        })
        return storeRegister;
    }

    async update(id: string, data: { cnpj: string, imageUrl: string, description: string, title: string }): Promise<Store | null> {
        const storeUpdate = await prisma.store.update({
            where: {
                id
            },
            data: {
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
                cnpj: data.cnpj,
            }
        })
        return storeUpdate;
    }

}