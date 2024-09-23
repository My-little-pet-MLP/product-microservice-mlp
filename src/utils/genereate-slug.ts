export function generateSlug(title: string): string {
    return title
        .toLowerCase() // converte para minúsculas
        .normalize("NFD") // decompõe caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/\s+/g, '-') // substitui espaços por hífens
        .replace(/[^\w-]+/g, '') // remove caracteres especiais
        .replace(/--+/g, '-') // substitui múltiplos hífens por um único hífen
        .replace(/^-+/, '') // remove hífen do início
        .replace(/-+$/, ''); // remove hífen do final
}