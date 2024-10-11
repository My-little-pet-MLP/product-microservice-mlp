import { RegisterStoreService } from "./register-store.service";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { clerkClient } from "../../lib/cleark";
import { UserNotFoundError } from "../error/user-not-found-error";

// Mock da API do clerkClient
jest.mock("../../lib/cleark");

describe("RegisterStoreService", () => {
  let storeRepository: InMemoryStoreRepository;
  let registerStoreService: RegisterStoreService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    registerStoreService = new RegisterStoreService(storeRepository);
    jest.clearAllMocks(); // Limpar todos os mocks antes de cada teste
  });

  it("should register a store successfully if the user exists", async () => {
    // Mock para simular que o usuário existe no clerkClient
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
      id: "user123",
      email: "user@example.com",
    });

    // Executando o serviço para registrar a loja
    const response = await registerStoreService.execute({
      title: "Loja Teste",
      description: "Descrição da loja",
      cnpj: "12345678901234",
      userId: "user123",
      imageUrl: "http://example.com/store.jpg",
    });

    // Verificando se a loja foi registrada corretamente
    expect(response.storeRegister).toBeTruthy();
    expect(response.storeRegister?.title).toBe("Loja Teste");
    expect(response.error).toBeNull();
  });

  it("should return an error if the user does not exist", async () => {
    // Mock para simular que o usuário não existe no clerkClient
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue(null);

    // Executando o serviço com um userId inexistente
    const response = await registerStoreService.execute({
      title: "Loja Teste",
      description: "Descrição da loja",
      cnpj: "12345678901234",
      userId: "non-existing-user",
      imageUrl: "http://example.com/store.jpg",
    });

    // Verificando se o erro foi retornado corretamente
    expect(response.storeRegister).toBeNull();
    expect(response.error).toBeInstanceOf(UserNotFoundError);
  });
});
