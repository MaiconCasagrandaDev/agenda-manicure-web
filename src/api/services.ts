// Formato de um serviço, igual ao que a rota GET /services devolve
export type Service = {
    id: number;
    name: string;
    price: string; // o Decimal do banco chega como texto no JSON (ex.: "35")
    priceIsStartingAt: boolean;
    durationMinutes: number;
    imageUrl: string | null;
};

// Endereço da API, lido do .env
const API_URL = import.meta.env.VITE_API_URL;

export async function getServices(): Promise<Service[]> {
    const response = await fetch(`${API_URL}/services`);

    // O fetch só dá erro se a rede cair. Se a API responder 404 ou 500,
    // ele "funciona", então a gente confere o status na mão.
    if (!response.ok) {
        throw new Error(`Erro ao buscar serviços: ${response.status}`);
    }

    return response.json();
}
