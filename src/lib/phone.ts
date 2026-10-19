// Remove tudo que não é número
function onlyDigits(value: string) {
    return value.replace(/\D/g, "");  
}

// Aceita "54999991234", "(54) 99999-1234" ou "+55 54 99999-1234".
// Devolve os 11 dígitos (DDD + número) ou null se não for um celular válido.
export function parseBrazilianMobile(input: string): string | null {
    let digits = onlyDigits(input);
    if (digits.length === 13 && digits.startsWith("55")) digits = digits.slice(2);
    // DDD (2 dígitos, sem zero) + 9 + 8 dígitos
    if (!/^[1-9]{2}9\d{8}$/.test(digits)) return null;
    return digits;
}

// "54999991234" → "(54) 99999-1234"
export function formatBrazilianMobile(digits: string) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}