import { useState } from "react";
import { Link } from "react-router";
import { useBooking } from "../booking/BookingContext";
import { TextField } from "../components/TextField";
import { formatBrazilianMobile, parseBrazilianMobile } from "../lib/phone";

type Errors = { firstName?: string; lastName?: string; phone?: string };

// Letras (inclusive com acento), espaço, hífen e apóstrofo. Ex.: "Ana Maria", "D'Ávila"
const NAME_PATTERN = /^\p{L}[\p{L}' -]*$/u;

function validateName(value: string) {
    const name = value.trim();
    if (name.length < 2) return "Preencha com pelo menos 2 letras.";
    if (name.length > 50) return "Use no máximo 50 caracteres.";
    if (!NAME_PATTERN.test(name)) return "Use só letras.";
    return undefined;
}

export function CustomerPage() {
    const { selectedServices, customer, setCustomer } = useBooking();

    // Se ela voltou para esta tela, os campos já vêm preenchidos
    const [firstName, setFirstName] = useState(customer?.firstName ?? "");
    const [lastName, setLastName] = useState(customer?.lastName ?? "");
    const [phone, setPhone] = useState(customer ? formatBrazilianMobile(customer.phone.slice(3)) : "");
    const [whatsappOptIn, setWhatsappOptIn] = useState(customer?.whatsappOptIn ?? false);
    const [errors, setErrors] = useState<Errors>({});
    const [saved, setSaved] = useState(false);

    if (selectedServices.length === 0) {
        return (
        <main className="mx-auto max-w-md px-4 pt-8">
            <p className="text-muted">Você ainda não escolheu nenhum serviço.</p>
            <Link to="/" className="mt-2 inline-block font-semibold text-primary">
            Escolher serviços
            </Link>
        </main>
        );
    }

    // Aplica a máscara só quando ela sai do campo (evita o cursor pular)
    function handlePhoneBlur() {
        const digits = parseBrazilianMobile(phone);
        if (digits) setPhone(formatBrazilianMobile(digits));
    }

    function handleSubmit() {
        const phoneDigits = parseBrazilianMobile(phone);
        const newErrors: Errors = {
        firstName: validateName(firstName),
        lastName: validateName(lastName),
        phone: phoneDigits ? undefined : "Informe um celular com DDD. Ex.: (54) 99999-1234",
        };
        setErrors(newErrors);

        if (newErrors.firstName || newErrors.lastName || !phoneDigits) return;

        setCustomer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: `+55${phoneDigits}`,
        whatsappOptIn,
        });
        setSaved(true);
    }

    return (
        <main className="mx-auto max-w-md px-4 pt-8 pb-12">
        <Link to="/" className="text-sm text-primary">← Voltar</Link>
        <h1 className="mt-4 text-2xl font-semibold text-ink">Seus dados</h1>
        <p className="mt-1 text-sm text-muted">
            {selectedServices.map((s) => s.name).join(", ")}
        </p>

        <form
            noValidate
            className="mt-6 space-y-4"
            onSubmit={(e) => {
            e.preventDefault(); // impede o navegador de recarregar a página
            handleSubmit();
            }}
        >
            <TextField
            id="firstName"
            label="Nome"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
            />
            <TextField
            id="lastName"
            label="Sobrenome"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
            />
            <TextField
            id="phone"
            label="Celular (WhatsApp)"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(54) 99999-1234"
            maxLength={20}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={handlePhoneBlur}
            error={errors.phone}
            />

            {/* Começa desmarcada: o consentimento precisa ser ativo */}
            <label className="flex items-start gap-3 text-sm text-ink">
            <input
                type="checkbox"
                className="mt-0.5 size-5 shrink-0 accent-primary"
                checked={whatsappOptIn}
                onChange={(e) => setWhatsappOptIn(e.target.checked)}
            />
            Quero receber a confirmação e o lembrete do horário pelo WhatsApp
            </label>

            <p className="text-xs text-muted">
            Seus dados são usados só para o seu agendamento.
            </p>

            <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
            Continuar
            </button>

            {saved && (
            <p className="text-center text-sm text-muted">
                ✓ Dados salvos. A próxima tela entra em breve.
            </p>
            )}
        </form>
        </main>
    );
}