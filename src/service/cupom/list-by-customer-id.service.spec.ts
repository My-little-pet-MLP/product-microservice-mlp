
import { InMemoryCupomRepository } from "../../repository/in-memory-repository/in-memory-cupom-repository";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";
import { StoreNotFoundError } from "../error/store-not-found-error";
import { ListAllCupomByCustomerIdAndStoreIdService } from "./list-by-customer-id.service";

jest.mock("../../lib/cleark");

describe("ListAllCupomByCustomerIdAndStoreIdService", () => {
    let cupomRepository: InMemoryCupomRepository;
    let storeRepository: InMemoryStoreRepository;
    let listAllCupomService: ListAllCupomByCustomerIdAndStoreIdService;

    beforeEach(() => {
        cupomRepository = new InMemoryCupomRepository();
        storeRepository = new InMemoryStoreRepository();
        listAllCupomService = new ListAllCupomByCustomerIdAndStoreIdService(cupomRepository, storeRepository);
    });

    it("should return an error if the customer is not found", async () => {
        (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(null); // Customer not found

        const response = await listAllCupomService.execute({
            customerId: "invalid-customer",
            storeId: "store-1",
        });

        expect(response.cupons).toBeNull();
        expect(response.error).toBeInstanceOf(CustomerNotFoundError);
    });

    it("should return an error when there is an issue fetching customer information", async () => {
        (clearkClientCustomer.users.getUser as jest.Mock).mockRejectedValue(new Error()); // Error fetching customer

        const response = await listAllCupomService.execute({
            customerId: "customer-123",
            storeId: "store-1",
        });

        expect(response.cupons).toBeNull();
        expect(response.error).toBeInstanceOf(ErrorFetchingCustomerError);
    });

    it("should return an error if the store is not found", async () => {
        (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(true); // Customer found

        const response = await listAllCupomService.execute({
            customerId: "customer-123",
            storeId: "invalid-store",
        });

        expect(response.cupons).toBeNull();
        expect(response.error).toBeInstanceOf(StoreNotFoundError);
    });

    it("should return cupons for a valid customer and store", async () => {
        (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(true); // Customer found

        // Add a store and a coupon for testing
        const store = await storeRepository.register("Test Store", "Test Store Description", "123456789", "user-1", "http://example.com/image.jpg");
        await cupomRepository.register({
            id: "cupom-1",
            description: "Test Discount",
            porcentagem: 10,
            createdAt: new Date(),
            ValidateAt: new Date(new Date().getTime() + 1000000),
            isValid: true,
            storeId: store.id,
            customerId: "customer-123"
        });

        const response = await listAllCupomService.execute({
            customerId: "customer-123",
            storeId: store.id,
        });

        expect(response.error).toBeNull();
        expect(response.cupons).not.toBeNull();
        expect(response.cupons?.length).toBe(1);
        expect(response.cupons?.[0].description).toBe("Test Discount");
    });
});
