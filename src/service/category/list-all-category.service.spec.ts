import { ListAllCategoryService } from "./list-all-category.service";
import { InMemoryCategoryRepository } from "../../repository/in-memory-repository/in-memory-category-repository";

describe("ListAllCategoryService", () => {
  it("should return an empty list when there are no categories", async () => {
    // Instanciando o repositório in-memory
    const categoryRepository = new InMemoryCategoryRepository();

    // Instanciando o serviço com o repositório
    const listAllCategoryService = new ListAllCategoryService(categoryRepository);

    // Executando o serviço de listagem de categorias
    const response = await listAllCategoryService.execute({});

    // Verificando se a lista está vazia
    expect(response.categories).toHaveLength(0);
  });

  it("should return a list of categories when there are categories", async () => {
    // Instanciando o repositório in-memory
    const categoryRepository = new InMemoryCategoryRepository();

    // Adicionando categorias ao repositório in-memory
    await categoryRepository.register({ title: "Tecnologia", slug: "tecnologia" });
    await categoryRepository.register({ title: "Saúde", slug: "saude" });

    // Instanciando o serviço com o repositório
    const listAllCategoryService = new ListAllCategoryService(categoryRepository);

    // Executando o serviço de listagem de categorias
    const response = await listAllCategoryService.execute({});

    // Verificando se a lista contém as categorias adicionadas
    expect(response.categories).toHaveLength(2);
    expect(response.categories[0].title).toBe("Tecnologia");
    expect(response.categories[1].title).toBe("Saúde");
  });
});
