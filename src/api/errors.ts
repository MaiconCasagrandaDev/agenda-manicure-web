// Erro que carrega a mensagem enviada pela API (ex.: "Esse horário acabou de ser reservado")
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export async function toApiError(response: Response) {
    const body = await response.json().catch(() => null);
    return new ApiError(body?.error ?? "Algo deu errado. Tente novamente.", response.status);
}