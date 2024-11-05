import { InMemoryCupomRepository } from "../../repository/in-memory-repository/in-memory-cupom-repository";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { InvalidDateFormatForValidateAtError } from "../error/invalid-date-format-for-validate-at-error";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { StoreNotFoundError } from "../error/store-not-found-error";
import { RegisterCupomService } from "./register-cupom.service";


describe("RegisterCupomService", () => {
    let cupomRepository: InMemoryCupomRepository;
    let storeRepository: InMemoryStoreRepository;
    let registerCupomService: RegisterCupomService;

    beforeEach(() => {
        cupomRepository = new InMemoryCupomRepository();
        storeRepository = new InMemoryStoreRepository();
        registerCupomService = new RegisterCupomService(storeRepository, cupomRepository);
    });

    it("should return an error if the validateAt date is in an invalid format", async () => {
        const response = await registerCupomService.execute({
            storeId: "store-1",
            description: "Discount",
            porcentagem: 10,
            validateAt: "invalid-date",
            quantity: 1
        });

        expect(response.error).toBeInstanceOf(InvalidDateFormatForValidateAtError);
        expect(response.cupomInfo).toBeNull();
        expect(response.quantityCreated).toBe(0);
    });

    it("should return an error if the quantity is negative or zero", async () => {
        const response = await registerCupomService.execute({
            storeId: "store-1",
            description: "Discount",
            porcentagem: 10,
            validateAt: "2024-12-31",
            quantity: 0
        });

        expect(response.error).toBeInstanceOf(QuantityIsNegativeError);
        expect(response.cupomInfo).toBeNull();
        expect(response.quantityCreated).toBe(0);
    });

    it("should return an error if the store does not exist", async () => {
        const response = await registerCupomService.execute({
            storeId: "non-existent-store",
            description: "Discount",
            porcentagem: 10,
            validateAt: "2024-12-31",
            quantity: 1
        });

        expect(response.error).toBeInstanceOf(StoreNotFoundError);
        expect(response.cupomInfo).toBeNull();
        expect(response.quantityCreated).toBe(0);
    });

    it("should register multiple cupons when quantity is greater than 1", async () => {
       // Registrando uma loja no repositório in-memory
       const store = await storeRepository.register(
        "Loja Teste",
        "Descrição da loja",
        "12345678901234",
        "user123",
        "http://example.com/store.jpg"
      );
  

        const response = await registerCupomService.execute({
            storeId: store.id,
            description: "Bulk Discount",
            porcentagem: 15,
            validateAt: "2024-12-31",
            quantity: 5
        });

        expect(response.error).toBeNull();
        expect(response.cupomInfo).not.toBeNull();
        expect(response.quantityCreated).toBe(5);

        const cupons = await cupomRepository.listByStoreId(store.id);
        expect(cupons).toHaveLength(5);
        expect(cupons[0]).toMatchObject({
            storeId: store.id,
            description: "Bulk Discount",
            porcentagem: 15,
            isValid: true
        });
    });

    it("should register a single cupom when quantity is 1", async () => {
          // Registrando uma loja no repositório in-memory
          const store = await storeRepository.register(
            "Loja Teste",
            "Descrição da loja",
            "12345678901234",
            "user123",
            "http://example.com/store.jpg"
          );
      

        const response = await registerCupomService.execute({
            storeId: store.id, // ID da loja registrada
            description: "Single Discount",
            porcentagem: 5,
            validateAt: "2024-12-31",
            quantity: 1
        });

        expect(response.error).toBeNull();
        expect(response.cupomInfo).not.toBeNull();
        expect(response.quantityCreated).toBe(1);

        const cupons = await cupomRepository.listByStoreId(store.id);
        expect(cupons).toHaveLength(1);
        expect(cupons[0]).toMatchObject({
            storeId: store.id,
            description: "Single Discount",
            porcentagem: 5,
            isValid: true
        });
    });
});