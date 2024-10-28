import { InMemoryPetRepository } from "../../repository/in-memory-repository/in-memory-pet-repository";
import { ListAllByCustomerIdService } from "../pet/list-all-by-customer-id.service";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";


jest.mock("../../lib/cleark"); // Mock the external function

describe("ListAllByCustomerIdService", () => {
  let petRepository: InMemoryPetRepository;
  let listAllByCustomerIdService: ListAllByCustomerIdService;

  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    listAllByCustomerIdService = new ListAllByCustomerIdService(petRepository);
  });

  it("should list all pets for an existing customer", async () => {
    (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(true);

    await petRepository.register({
      id: "pet-1",
      name: "Rex",
      breed: "Labrador",
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
      customerId: "customer-123",
    });

    const response = await listAllByCustomerIdService.execute({ customerId: "customer-123" });

    expect(response.pets).not.toBeNull();
    expect(response.pets?.length).toBe(1);
    expect(response.error).toBeNull();
  });

  it("should return error if the customer does not exist", async () => {
    (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(null);

    const response = await listAllByCustomerIdService.execute({ customerId: "non-existent" });

    expect(response.pets).toBeNull();
    expect(response.error).toBeInstanceOf(CustomerNotFoundError);
  });

  it("should return error if there is an issue fetching the customer", async () => {
    (clearkClientCustomer.users.getUser as jest.Mock).mockRejectedValue(new Error());

    const response = await listAllByCustomerIdService.execute({ customerId: "customer-123" });

    expect(response.pets).toBeNull();
    expect(response.error).toBeInstanceOf(ErrorFetchingCustomerError);
  });

  it("should return an empty list if the customer has no pets", async () => {
    (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(true);

    const response = await listAllByCustomerIdService.execute({ customerId: "customer-123" });

    expect(response.pets).toEqual([]);
    expect(response.error).toBeNull();
  });
});