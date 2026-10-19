import { toApiError } from "./errors";

const API_URL = import.meta.env.VITE_API_URL;

export type Admin = { email: string };

// credentials: "include" → o navegador envia e guarda o cookie da API,
// mesmo ela estando em outra porta (outra origem)
export async function login(email: string, password: string): Promise<Admin> {
    const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw await toApiError(response);
    return response.json();
}

// Quem está logado? null = ninguém
export async function getMe(): Promise<Admin | null> {
    const response = await fetch(`${API_URL}/admin/me`, { credentials: "include" });
    if (response.status === 401) return null;
    if (!response.ok) throw await toApiError(response);
    return response.json();
}

export async function logout() {
    const response = await fetch(`${API_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) throw await toApiError(response);
}