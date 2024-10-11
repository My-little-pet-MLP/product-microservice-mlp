import { RegisterCategoryService } from "./register-category.service";
import { InMemoryCategoryRepository } from "../../repository/in-memory-repository/in-memory-category-repository";

describe("RegisterCategoryService", () => {
  it("should create a new category with the correct slug", async () => {
    // Instanciando o repositório in-memory
    const categoryRepository = new InMemoryCategoryRepository();

    // Instanciando o serviço com o repositório
    const registerCategoryService = new RegisterCategoryService(categoryRepository);

    // Executando o serviço para registrar uma nova categoria
    const response = await registerCategoryService.execute({
      title: "Nova Categoria"
    });

    // Verificando se a categoria foi criada corretamente
    expect(response.category).toHaveProperty("id");
    expect(response.category.title).toBe("Nova Categoria");
    expect(response.category.slug).toBe("nova-categoria");
  });

  it("should generate a slug and register the category", async () => {
    const categoryRepository = new InMemoryCategoryRepository();
    const registerCategoryService = new RegisterCategoryService(categoryRepository);

    const categoryTitle = "Tecnologia Avançada";
    const response = await registerCategoryService.execute({ title: categoryTitle });

    expect(response.category.slug).toBe("tecnologia-avancada");
    expect(response.category.title).toBe(categoryTitle);
    expect(response.category).toHaveProperty("id");
  });
});