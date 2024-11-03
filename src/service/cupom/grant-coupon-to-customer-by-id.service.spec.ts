import { clearkClientCustomer } from "../../lib/cleark";
import { InMemoryCupomRepository } from "../../repository/in-memory-repository/in-memory-cupom-repository";
import { CupomNotFoundError } from "../error/cupom-not-found-error";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";
import { GrantCouponToCustomerByIdService } from "./grant-coupon-to-customer-by-id.service";


jest.mock("../../lib/cleark");

describe("GrantCouponToCustomerByIdService", () => {
    let cupomRepository: InMemoryCupomRepository;
    let grantCouponService: GrantCouponToCustomerByIdService;

    beforeEach(() => {
        cupomRepository = new InMemoryCupomRepository();
        grantCouponService = new GrantCouponToCustomerByIdService(cupomRepository);
    });

    it("should return an error if no available coupon is found", async () => {
        (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(true); // Mock cliente válido

        const response = await grantCouponService.execute({
            customerId: "customer-1",
        });

        expect(response.error).toBeInstanceOf(CupomNotFoundError);
        expect(response.cupom).toBeNull();
    });

    it("should return an error if the customer is not found", async () => {
        (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(null); // Mock cliente inexistente

        const response = await grantCouponService.execute({
            customerId: "inexistent-customer",
        });

        expect(response.error).toBeInstanceOf(CustomerNotFoundError);
        expect(response.cupom).toBeNull();
    });

    it("should return an error if there is an error fetching the customer", async () => {
        (clearkClientCustomer.users.getUser as jest.Mock).mockRejectedValue(new Error()); // Mock erro ao buscar cliente

        const response = await grantCouponService.execute({
            customerId: "customer-123",
        });

        expect(response.error).toBeInstanceOf(ErrorFetchingCustomerError);
        expect(response.cupom).toBeNull();
    });

    it("should grant an available coupon to the customer", async () => {
        (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(true); // Mock cliente válido

        // Registrar um cupom disponível (customerId = null)
        await cupomRepository.register({
            id: "cupom-1",
            description: "Desconto de 10%",
            porcentagem: 10,
            createdAt: new Date(),
            ValidateAt: new Date(new Date().getTime() + 10000000),
            isValid: true,
            storeId: "store-1",
            customerId: null, // Cupom ainda não atribuído
        });

        const response = await grantCouponService.execute({
            customerId: "customer-1",
        });

        expect(response.error).toBeNull();
        expect(response.cupom).not.toBeNull();
        expect(response.cupom?.customerId).toBe("customer-1");
    });

    it("should not grant the same coupon to another customer", async () => {
        (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(true); // Mock cliente válido

        // Registrar um cupom e atribuí-lo ao primeiro cliente
        const initialCupom = await cupomRepository.register({
            id: "cupom-1",
            description: "Desconto de 10%",
            porcentagem: 10,
            createdAt: new Date(),
            ValidateAt: new Date(new Date().getTime() + 10000000),
            isValid: true,
            storeId: "store-1",
            customerId: null, // Inicialmente sem cliente
        });

        // Conceder o cupom ao primeiro cliente
        await grantCouponService.execute({
            customerId: "customer-1",
        });

        // Tentar conceder o mesmo cupom ao segundo cliente
        const response = await grantCouponService.execute({
            customerId: "customer-2",
        });

        expect(response.error).toBeInstanceOf(CupomNotFoundError);
        expect(response.cupom).toBeNull();
    });
});