# Painel de Gestão de Eventos

Painel para acompanhar eventos, controlar o acesso de participantes (check-in/checkout)
e visualizar métricas em um dashboard. Desenvolvido como teste técnico de Front-End.

🔗 **Demo:** _adicione aqui a URL do deploy (Vercel)_

---

## ✨ Funcionalidades

- **Listagem de eventos** com busca por nome (_debounced_), filtro por status e
  ordenação por data, tratando os estados de **loading**, **vazio** e **erro**.
- **Dashboard do evento** com 4 cards de métricas, 2 gráficos e tabela de participantes.
- **Controle de acesso** com regras de negócio por tipo de participante e status do evento.
- **Feedback claro** a cada ação via _toasts_.
- **Responsivo** (desktop com tabela / mobile com cards) e com cuidados de acessibilidade.

## 🧱 Stack e decisões técnicas

| Área | Escolha | Justificativa |
| --- | --- | --- |
| Framework | **Next.js 16 (App Router)** | File-based routing, Server Components e _build_ estático onde possível. |
| Linguagem | **TypeScript (strict)** | Contrato de dados tipado, menos erros em tempo de execução. |
| Estado de servidor | **TanStack Query** | Cache, _loading/error_ e _refetch_ prontos, sem _boilerplate_. |
| Estado de simulação | **Zustand** | Camada de check-ins simples, performática e fácil de testar. |
| UI | **Tailwind CSS v4 + shadcn/ui** | Design system próprio (componentes no repo) e acessibilidade via Base UI. |
| Gráficos | **Recharts** | API declarativa e responsiva. |
| Testes | **Vitest + Testing Library** | Rápido, compatível com o ecossistema Vite/React. |

### Integração com a API (Opção A) + simulação no cliente

Foi escolhida a **Opção A** (leitura via GitHub Pages, somente `GET`), o que mantém a
aplicação **100% deployável na Vercel sem backend**. Como o enunciado pede para
**simular** entradas/saídas, os check-ins são uma **camada de simulação no cliente**:

1. O TanStack Query busca eventos e o detalhe (com `participants[]` e `checkins[]`).
2. Um store Zustand (`src/store/checkin-store.ts`) guarda um _overlay_ por evento
   (status do participante, contadores e histórico anexado).
3. `applyOverlay()` combina os dados da API com o _overlay_, produzindo o **estado
   efetivo** que alimenta cards, gráficos e tabela. As métricas são **recalculadas**.

> Para usar a **Opção B** (json-server com escrita real), basta subir o servidor local
> e apontar `NEXT_PUBLIC_API_BASE_URL` para ele — a camada `src/lib/api.ts` está isolada.

### Regras de negócio (`src/lib/rules.ts`)

As regras vivem em **funções puras**, reutilizadas tanto pela UI (rótulo/estado do
botão) quanto pelo store (registro da ação) — e por isso totalmente testáveis:

- **Normal** → apenas **1** check-in; nova tentativa retorna erro `already_checked_in`.
- **VIP** → pode **entrar e sair** múltiplas vezes; cada ação entra no histórico.
- **Evento `closed`/`cancelled`** → bloqueia entradas; o botão fica **desabilitado**
  com o motivo visível.

| Ação | Resultado | Feedback |
| --- | --- | --- |
| Check-in VIP | Sucesso | Entrada registrada, status → "inside" |
| Check-in Normal (1ª vez) | Sucesso | Check-in registrado |
| Check-in Normal (2ª vez) | Erro | "Participante já realizou check-in" |
| Check-in em evento encerrado | Bloqueado | Botão desabilitado, motivo exibido |
| Saída VIP | Sucesso | Status → "outside", pode entrar de novo |

### Edge cases tratados

- `EVT-002` (closed) e `EVT-004` (cancelled): check-ins bloqueados com aviso.
- `EVT-004` com métricas zeradas: dashboard e gráficos renderizam vazios sem quebrar.
- VIPs com `checkin_count > 1` e histórico alternado `entry/exit`.
- `error_reason` _nullable_: sucesso e os dois motivos de erro são tratados.
- Participante `outside` com `checkin_count > 0` (saiu) é exibido corretamente.

## 🗂️ Estrutura

```
src/
  app/                # rotas (App Router): /events e /events/[id]
  components/
    common/           # estados (vazio/erro)
    events/           # listagem: card, filtros, status badge
    dashboard/        # métricas, gráficos, tabela, botão e histórico
    ui/               # componentes shadcn/ui
  hooks/              # React Query, debounce, check-in
  lib/                # types, api, rules, metrics, format
  store/              # checkin-store (Zustand)
```

## 🚀 Como rodar

> Requer **Node.js 20+**.

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros comandos:

```bash
npm run build    # build de produção
npm run test     # testes (Vitest)
npm run lint     # ESLint
```

(Opcional) Crie um `.env.local` a partir de `.env.example` para customizar a API.

## 🧪 Testes

Três frentes cobrindo os comportamentos relevantes:

- `src/lib/rules.test.ts` — regras VIP × Normal × evento encerrado.
- `src/components/events/event-list.test.tsx` — estados de loading, vazio e erro.
- `src/components/dashboard/checkin-button.test.tsx` — clique dispara a ação, atualiza
  o estado e impede o 2º check-in de um participante normal.

## 🔮 Melhorias com mais tempo

- Integração com a **Opção B** (json-server) para persistência real de check-ins.
- Paginação/virtualização da lista de participantes para eventos grandes.
- Persistir a simulação (localStorage) e adicionar _dark mode_ no _toggle_.
- Testes e2e (Playwright) cobrindo a navegação completa.
- Sincronizar busca/filtros com a URL (_query params_).

## 🤖 Uso de IA

Utilizei IA (assistente de código) como par de programação para acelerar tarefas
mecânicas: scaffolding inicial, configuração de Vitest, rascunho de componentes de UI
e revisão de tipos. As **decisões de arquitetura** (Opção A + simulação no cliente,
regras puras testáveis, modelo de _overlay_ de estado) e a revisão final do código
foram conduzidas e validadas por mim.
