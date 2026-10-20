import type { ReactNode } from "react";

type BookingFooterProps = {
  children: ReactNode; // o resumo que aparece à esquerda
  disabled: boolean;
  onNext?: () => void; // ação do botão (telas sem formulário)
  formId?: string;     // ou: o id do formulário que o botão envia
  label?: string;
};

// Rodapé fixo das telas do agendamento: resumo à esquerda, botão à direita
export function BookingFooter({
  children,
  disabled,
  onNext,
  formId,
  label = "Avançar",
}: BookingFooterProps) {
  return (
    <footer className="fixed inset-x-0 bottom-0 border-t border-soft bg-surface">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0 text-sm">{children}</div>
        <button
          // Com formId, o botão vira "enviar" daquele formulário,
          // mesmo estando fora dele (atributo form do HTML)
          type={formId ? "submit" : "button"}
          form={formId}
          onClick={onNext}
          disabled={disabled}
          className="shrink-0 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {label}
        </button>
      </div>
    </footer>
  );
}