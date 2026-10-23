# Agenda Manicure · Web

Site de agendamento online de um estúdio de manicure. As clientes marcam horário pelo celular em poucos passos, e a profissional gerencia tudo por um painel.

> 🚧 Projeto em desenvolvimento. A API está em [agenda-manicure-api](https://github.com/MaiconCasagrandaDev/agenda-manicure-api).

## Telas

**Cliente**
1. **Serviços:** lista com foto, preço e duração; dá para escolher até 3
2. **Horário:** dias disponíveis e horários separados em manhã e tarde
3. **Seus dados:** nome e celular
4. **Pedido recebido:** resumo do agendamento, aguardando confirmação

**Painel da profissional**
- **Pedidos:** confirma ou recusa, com mensagem pronta para o WhatsApp
- **Agenda:** dia a dia, com lembrete e cancelamento pelo WhatsApp
- **Bloqueios:** dia inteiro, manhã, tarde, horário específico ou férias; se houver clientes marcadas, mostra quem são e permite cancelar e avisar cada uma

## Destaques

- Pensado primeiro para o celular
- Datas e horários sempre no fuso de Brasília, mesmo que o aparelho esteja em outro fuso
- Avisos pelo WhatsApp com links `wa.me` e mensagem pronta, sem custo por mensagem
- Sessão do painel por cookie `HttpOnly`, enviado com `credentials: "include"`

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS v4
- React Router

## Como rodar

Pré-requisitos: Node.js e a [API](https://github.com/MaiconCasagrandaDev/agenda-manicure-api) rodando.

```bash
npm install
```

Crie um arquivo `.env` na raiz com o endereço da API. **Nunca suba o `.env` para o GitHub.**

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

- Cliente: `http://localhost:5173/`
- Painel: `http://localhost:5173/admin`

## Estrutura

```
src/
├── api/          # chamadas à API
├── booking/      # estado do agendamento (Context)
├── components/   # cabeçalho, rodapé, cards, campos
├── lib/          # formatação, telefone, WhatsApp
└── pages/        # telas da cliente
    └── admin/    # telas do painel
```

## Próximos passos

- Calendário do mês no painel
- Lembrar os dados da cliente no aparelho
- Área "Meus horários" para a cliente
- Página inicial do estúdio
- Deploy

---

Desenvolvido por [Maicon Casagranda](https://github.com/MaiconCasagrandaDev) · estudante de Análise e Desenvolvimento de Sistemas.