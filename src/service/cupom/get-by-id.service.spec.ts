import { GetCupomByIdService } from "../cupom/get-by-id.service";
import { InMemoryCupomRepository } from "../../repository/in-memory-repository/in-memory-cupom-repository";
import { CupomNotFoundError } from "../error/cupom-not-found-error";

describe("GetCupomByIdService", () => {
    let inMemoryCupomRepository: InMemoryCupomRepository;
    let getCupomByIdService: GetCupomByIdService;

    beforeEach(() => {
        inMemoryCupomRepository = new InMemoryCupomRepository();
        getCupomByIdService = new GetCupomByIdService(inMemoryCupomRepository);
    });

    it("should return a cupom if it exists", async () => {
        const cupomData = {
            id: "test-id-123",
            description:"test 1",
            porcentagem: 20,
            createdAt: new Date(),
            ValidateAt: new Date(),
            isValid: true,
            storeId: "store-id-123",
            customerId: "customer-id-123"
        };
        await inMemoryCupomRepository.register(cupomData);

        const response = await getCupomByIdService.execute({ id: "test-id-123" });

        expect(response.cupom).toEqual(cupomData);
        expect(response.error).toBeNull();
    });

    it("should return an error if the cupom does not exist", async () => {
        const response = await getCupomByIdService.execute({ id: "non-existent-id" });

        expect(response.cupom).toBeNull();
        expect(response.error).toBeInstanceOf(CupomNotFoundError);
    });

    it("should handle when the repository throws an error", async () => {
        jest.spyOn(inMemoryCupomRepository, 'getById').mockImplementationOnce(() => {
            throw new Error("Unexpected error");
        });

        await expect(getCupomByIdService.execute({ id: "test-id-123" })).rejects.toThrow("Unexpected error");
    });

    it("should return the correct cupom if multiple cupons exist", async () => {
        const cupomData1 = {
            id: "test-id-123",
            description:"test 1",
            porcentagem: 10,
            createdAt: new Date(),
            ValidateAt: new Date(),
            isValid: true,
            storeId: "store-id-123",
            customerId: "customer-id-123"
        };
        const cupomData2 = {
            id: "test-id-456",
            description:"test 2",
            porcentagem: 20,
            createdAt: new Date(),
            ValidateAt: new Date(),
            isValid: true,
            storeId: "store-id-456",
            customerId: "customer-id-456"
        };
        await inMemoryCupomRepository.register(cupomData1);
        await inMemoryCupomRepository.register(cupomData2);

        const response = await getCupomByIdService.execute({ id: "test-id-456" });

        expect(response.cupom).toEqual(cupomData2);
        expect(response.error).toBeNull();
    });

    it("should return null cupom and error when given an empty id", async () => {
        const response = await getCupomByIdService.execute({ id: "" });

        expect(response.cupom).toBeNull();
        expect(response.error).toBeInstanceOf(CupomNotFoundError);
    });
});
