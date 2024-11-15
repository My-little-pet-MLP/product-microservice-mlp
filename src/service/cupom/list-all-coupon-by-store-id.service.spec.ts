import { CupomRepository } from "../../repository/cupom-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";
import { ListAllCouponByStoreIdService } from "./list-all-coupon-by-store-id.service";

describe("ListAllCouponByStoreIdService", () => {
    let cupomRepository: jest.Mocked<CupomRepository>;
    let storeRepository: jest.Mocked<StoreRepository>;
    let service: ListAllCouponByStoreIdService;

    beforeEach(() => {
        cupomRepository = {
            listAllCouponByStore: jest.fn(),
            countCouponWhereCustomerIdIsNullAndStoreId: jest.fn(),
            countCouponWhereCustomerIdNotNullAndStoreId: jest.fn(),
            countCouponWhereDescription: jest.fn(),
            findById: jest.fn(),
        } as unknown as jest.Mocked<CupomRepository>;

        storeRepository = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<StoreRepository>;

        service = new ListAllCouponByStoreIdService(cupomRepository, storeRepository);
    });

    it("deve retornar erro se a loja não existir", async () => {
        storeRepository.findById.mockResolvedValue(null);

        const response = await service.execute({ storeId: "non-existent-store" });

        expect(response.error).toBeInstanceOf(StoreNotFoundError);
        expect(response.cupons).toEqual([]);
    });

    it("deve retornar os cupons corretamente para uma loja existente", async () => {
        const storeId = "store-1";
        const mockCoupons = [
            {
                id: "coupon-1",
                description: "10% OFF",
                porcentagem: 10,
                createdAt: new Date(),
                ValidateAt: new Date(new Date().setDate(new Date().getDate() + 30)), // Data de validade simulada
                isValid: true,
                storeId: "store-1",
                customerId: null,
            },
            {
                id: "coupon-2",
                description: "20% OFF",
                porcentagem: 20,
                createdAt: new Date(),
                ValidateAt: new Date(new Date().setDate(new Date().getDate() + 30)), // Data de validade simulada
                isValid: true,
                storeId: "store-1",
                customerId: "customer-1",
            },
        ];

        storeRepository.findById.mockResolvedValue({
            id: storeId,
            description: "Loja de Teste",
            createdAt: new Date(),
            imageUrl: "https://example.com/image.jpg",
            title: "Test Store",
            cnpj: "12345678000199",
            userId: "user-123",
            isActive: true,
            updatedAt: new Date(),
        });

        cupomRepository.listAllCouponByStore.mockResolvedValue(mockCoupons);
        cupomRepository.countCouponWhereCustomerIdIsNullAndStoreId.mockImplementation(async (storeId, description) =>
            description === "10% OFF" ? 5 : 3
        );
        cupomRepository.countCouponWhereCustomerIdNotNullAndStoreId.mockImplementation(async (storeId, description) =>
            description === "10% OFF" ? 10 : 7
        );

        const response = await service.execute({ storeId });

        expect(response.error).toBeNull();
        expect(response.cupons).toHaveLength(2);
        expect(response.cupons).toEqual([
            {
                cupons: { description: "10% OFF", porcentagem: 10, storeId },
                available: 5,
                delivered: 10,
                totalQuantity: 15,
            },
            {
                cupons: { description: "20% OFF", porcentagem: 20, storeId },
                available: 3,
                delivered: 7,
                totalQuantity: 10,
            },
        ]);
    });

    it("deve retornar lista vazia se não houver cupons", async () => {
        const storeId = "store-1";

        storeRepository.findById.mockResolvedValue({
            id: storeId,
            description: "Loja de Teste",
            createdAt: new Date(),
            imageUrl: "https://example.com/image.jpg",
            title: "Test Store",
            cnpj: "12345678000199",
            userId: "user-123",
            isActive: true,
            updatedAt: new Date(),
        });

        cupomRepository.listAllCouponByStore.mockResolvedValue([]);

        const response = await service.execute({ storeId });

        expect(response.error).toBeNull();
        expect(response.cupons).toEqual([]);
    });
});