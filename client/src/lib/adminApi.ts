const API = import.meta.env.VITE_API_URL || "/api";

export type Status = "pendente" | "confirmado" | "cancelado";

export type Agendamento = {
  id: number;
  cliente: string;
  telefone: string;
  servico: string;
  data: string;
  inicio: string;
  fim: string;
  status: Status;
};

export type Barbeiro = {
  id: string;
  nome: string;
};

const DEFAULT_TIMEOUT = 12_000;

function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit & { timeoutMs?: number }
) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    init?.timeoutMs ?? DEFAULT_TIMEOUT
  );

  return fetch(input, {
    ...init,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
}

function authHeader(token: string) {
  return {
    "x-admin-token": token,
  };
}

export async function pingHealth() {
  const r = await fetchWithTimeout(`${API}/health`, { timeoutMs: 5_000 });
  if (!r.ok) throw new Error("offline");
  return true;
}

export async function fetchBarbeiros(token: string) {
  const r = await fetchWithTimeout(`${API}/admin/barbeiros`, {
    headers: authHeader(token),
  });

  if (r.status === 401) throw new Error("unauthorized");

  const j = await r.json();
  if (!r.ok) throw new Error(j?.mensagem || "Erro ao carregar barbeiros");

  return (j.barbeiros || []) as Barbeiro[];
}

export async function fetchAgendamentos(
  token: string,
  barbeiroId: string,
  data: string
) {
  const r = await fetchWithTimeout(
    `${API}/admin/agendamentos?data=${encodeURIComponent(
      data
    )}&barbeiro_id=${encodeURIComponent(barbeiroId)}`,
    {
      headers: authHeader(token),
    }
  );

  if (r.status === 401) throw new Error("unauthorized");

  const j = await r.json();
  if (!r.ok) throw new Error(j?.mensagem || "Erro ao carregar agenda");

  return (j.agendamentos || []) as Agendamento[];
}

export async function atualizarStatus(
  token: string,
  id: number,
  status: Status
) {
  const r = await fetchWithTimeout(`${API}/admin/agendamentos/${id}`, {
    method: "PATCH",
    headers: {
      ...authHeader(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (r.status === 401) throw new Error("unauthorized");

  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.mensagem || "Erro ao atualizar status");

  return true;
}
