import { useEffect, useState } from "react";
import { getServices, type Service } from "../api/services";

export function ServicesPage() {
    // Três estados possíveis da tela: carregando, deu erro, ou com os serviços
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Roda uma vez quando a tela aparece: busca os serviços na API
    useEffect(() => {
    let ignore = false; // evita atualizar a tela se ela já foi fechada

    getServices()
        .then((data) => { if (!ignore) setServices(data); })
        .catch(() => { if (!ignore) setError(true); })
        .finally(() => { if (!ignore) setLoading(false); });

        return () => { ignore = true; };
    }, []);

    if (loading) return <p className="p-6 text-muted">Carregando serviços...</p>;
    if (error) return <p className="p-6 text-primary">Não foi possível carregar os serviços.</p>;

    return (
        <main className="p-6">
        <h1 className="text-2xl font-semibold">Escolha seus serviços</h1>
        <ul className="mt-4 space-y-2">
            {services.map((service) => (
            <li key={service.id}>{service.name}</li>
            ))}
        </ul>
        </main>
    );
}