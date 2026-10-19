import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label: string;
    error?: string;
};

export function TextField({ id, label, error, ...inputProps }: TextFieldProps) {
    const errorId = `${id}-error`;

    return (
        <div>
        {/* htmlFor liga o rótulo ao campo: clicar no texto foca o input */}
        <label htmlFor={id} className="block text-sm font-semibold text-ink">
            {label}
        </label>
        <input
            id={id}
            // avisam leitores de tela que o campo tem erro e onde está a mensagem
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`mt-1 w-full rounded-xl border-2 bg-surface px-3 py-3 text-ink outline-none transition focus:border-primary
            ${error ? "border-primary" : "border-soft"}`}
            {...inputProps}
        />
        {error && (
            <p id={errorId} className="mt-1 text-sm text-primary">
            {error}
            </p>
        )}
        </div>
    );
}