import { InMemoryCupomRepository } from "../../repository/in-memory-repository/in-memory-cupom-repository";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { CupomNotFoundError } from "../error/cupom-not-found-error";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { ApplyCupomInOrderService } from "./apply-cupom-in-order.service";


describe("ApplyCupomInOrderService", () => {
    let cupomRepository: InMemoryCupomRepository;
    let orderRepository: InMemoryOrderRepository;
    let applyCupomInOrderService: ApplyCupomInOrderService;

    beforeEach(() => {
        cupomRepository = new InMemoryCupomRepository();
        orderRepository = new InMemoryOrderRepository();
        applyCupomInOrderService = new ApplyCupomInOrderService(cupomRepository, orderRepository);
    });

    it("should return an error if the order does not exist", async () => {
        const response = await applyCupomInOrderService.execute({
            cupomId: "valid-cupom-id",
            orderId: "non-existent-order-id",
        });

        expect(response.error).toBeInstanceOf(OrderNotFoundError);
        expect(response.order).toBeNull();
    });

    it("should return an error if the cupom does not exist", async () => {
        // Primeiro, registrar um pedido válido no repositório
        const order = await orderRepository.register({
            fullPriceOrderInCents: 10000,
            storeId: "store-1",
            status: "pending",
            customerId: "customer-1",
        });

        const response = await applyCupomInOrderService.execute({
            cupomId: "non-existent-cupom-id",
            orderId: order.id,
        });

        expect(response.error).toBeInstanceOf(CupomNotFoundError);
        expect(response.order).toBeNull();
    });

    it("should apply a valid cupom to an existing order", async () => {
        // Registrar um pedido e um cupom válidos no repositório
        const order = await orderRepository.register({
            fullPriceOrderInCents: 10000,
            storeId: "store-1",
            status: "pending",
            customerId: "customer-1",
        });

        const cupom = await cupomRepository.register({
            description: "Desconto de 10%",
            porcentagem: 10,
            createdAt: new Date(),
            ValidateAt: new Date(new Date().getTime() + 10000000), // Data futura para o cupom ser válido
            isValid: true,
            storeId: "store-1",
            customerId: "customer-1",
        });

        // Adicionando verificação para `cupom` não ser `null`
        if (!cupom) {
            throw new Error("Failed to create cupom for test");
        }

        const response = await applyCupomInOrderService.execute({
            cupomId: cupom.id,
            orderId: order.id,
        });

        expect(response.error).toBeNull();
        expect(response.order).not.toBeNull();
        expect(response.order?.cupomId).toBe(cupom.id);
    });

});
