import { GetByIdCategoryService } from "./get-by-id-category.service";
import { InMemoryCategoryRepository } from "../../repository/in-memory-repository/in-memory-category-repository";
import { CategoryNotFoundError } from "../error/category-not-found-error";

describe("GetByIdCategoryService", () => {
  let categoryRepository: InMemoryCategoryRepository;
  let getByIdCategoryService: GetByIdCategoryService;

  // Cria uma instância do repositório e do serviço antes de cada teste
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository();
    getByIdCategoryService = new GetByIdCategoryService(categoryRepository);
  });

  it("should return a category by id if it exists", async () => {
    // Registrando uma categoria para testar
    const categoryCreated = await categoryRepository.register({
      title: "Tecnologia",
      slug: "tecnologia",
    });

    // Executando o serviço
    const response = await getByIdCategoryService.execute({ id: categoryCreated.id });

    // Verificando se a categoria foi encontrada
    expect(response.category).toEqual(categoryCreated);
    expect(response.error).toBeNull();
  });

  it("should return an error if category is not found", async () => {
    // Executando o serviço com um ID que não existe
    const response = await getByIdCategoryService.execute({ id: "non-existing-id" });

    // Verificando se retornou erro de categoria não encontrada
    expect(response.category).toBeNull();
    expect(response.error).toBeInstanceOf(CategoryNotFoundError);
  });
});
