import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import AgendamentoDetailsDrawer from "@/components/admin/AgendamentoDetailsDrawer";
import AgendamentosCards from "@/components/admin/AgendamentosCards";
import AgendamentosTable from "@/components/admin/AgendamentosTable";
import AdminHeader from "@/components/admin/AdminHeader";
import FiltersBar from "@/components/admin/FiltersBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { Agendamento, Barbeiro, Status } from "@/lib/adminApi";
import { atualizarStatus, fetchAgendamentos, fetchBarbeiros, pingHealth } from "@/lib/adminApi";
import { CalendarX2, LockKeyhole, Sparkles } from "lucide-react";

function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function usePersistedSearchParams(barbeiroId: string, data: string) {
  useEffect(() => {
    const params = new URLSearchParams();
    if (barbeiroId) params.set("barbeiro_id", barbeiroId);
    if (data) params.set("data", data);
    const qs = params.toString();
    const nextUrl = qs ? `/admin?${qs}` : "/admin";
    window.history.replaceState({}, "", nextUrl);
  }, [barbeiroId, data]);
}

function AdminLogin({ onLogin }: { onLogin: (t: string) => void }) {
  const [token, setToken] = useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-[#0f0806] to-black px-4 py-12 text-amber-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(217,166,106,0.15),_transparent_45%)]" aria-hidden />
      <Card className="relative w-full max-w-md space-y-6 border border-[#6e2317]/70 bg-black/60 p-8 shadow-2xl shadow-black/40">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#d9a66a] to-[#8c4b2f] text-black shadow-lg">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black">Área do Barbeiro</h2>
          <p className="text-sm text-amber-200/80">Digite a senha para acessar o painel de horários.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="token" className="text-amber-100">
            Senha de acesso
          </Label>
          <Input
            id="token"
            type="password"
            autoComplete="current-password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && token) onLogin(token);
            }}
            className="h-12 border-[#6e2317]/70 bg-black/60 text-amber-50"
            placeholder="Informe o token do administrador"
          />
        </div>
        <Button
          disabled={!token}
          onClick={() => onLogin(token)}
          className="h-12 w-full gap-2 bg-gradient-to-r from-[#d9a66a] to-[#8c4b2f] text-base font-semibold text-black shadow-lg hover:from-[#e6b778] hover:to-[#a05939]"
        >
          Entrar
        </Button>
      </Card>
    </div>
  );
}

export default function Admin() {
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [token, setToken] = useState(localStorage.getItem("belarmino_admin_token") || "");
  const [barbeiroId, setBarbeiroId] = useState(searchParams.get("barbeiro_id") || "");
  const [data, setData] = useState(searchParams.get("data") || hojeISO());
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selected, setSelected] = useState<Agendamento | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [online, setOnline] = useState<boolean | null>(null);
  const requestIdRef = useRef(0);

  usePersistedSearchParams(barbeiroId, data);

  /* ====== HEALTH ====== */
  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        await pingHealth();
        if (active) setOnline(true);
      } catch {
        if (active) setOnline(false);
      }
    };

    check();
    const id = setInterval(check, 25_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  /* ====== AUTH ====== */
  const login = useCallback((t: string) => {
    localStorage.setItem("belarmino_admin_token", t);
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("belarmino_admin_token");
    setToken("");
    setAgendamentos([]);
    setSelected(null);
  }, []);

  /* ====== LOAD BARBEIROS ====== */
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetchBarbeiros(token)
      .then((lista) => {
        if (!cancelled) setBarbeiros(lista);
      })
      .catch((e) => {
        if (e?.message === "unauthorized") {
          logout();
          return;
        }
        if (!cancelled) setErro(e.message || "Erro ao carregar barbeiros");
      });

    return () => {
      cancelled = true;
    };
  }, [logout, token]);

  /* ====== LOAD AGENDAMENTOS ====== */
  const carregarAgendamentos = useCallback(async () => {
    if (!token || !barbeiroId || !data) return;
    setErro("");
    setLoading(true);
    const currentId = ++requestIdRef.current;

    try {
      const lista = await fetchAgendamentos(token, barbeiroId, data);
      if (requestIdRef.current !== currentId) return;
      setAgendamentos(lista);
    } catch (e: any) {
      if (e?.message === "unauthorized") {
        logout();
        return;
      }
      if (requestIdRef.current !== currentId) return;
      setErro(e.message || "Erro ao carregar agenda");
      setAgendamentos([]);
    } finally {
      if (requestIdRef.current === currentId) setLoading(false);
    }
  }, [barbeiroId, data, logout, token]);

  /* ====== ACTIONS ====== */
  const handleStatusChange = useCallback(
    async (id: number, status: Status) => {
      setAgendamentos((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
      try {
        await atualizarStatus(token, id, status);
        toast.success(`Status atualizado para ${status}`);
        carregarAgendamentos();
      } catch (e: any) {
        if (e?.message === "unauthorized") {
          logout();
          return;
        }
        toast.error(e.message || "Erro ao atualizar status");
        carregarAgendamentos();
      }
    },
    [carregarAgendamentos, logout, token]
  );

  const agendamentosOrdenados = useMemo(
    () => [...agendamentos].sort((a, b) => (a.inicio > b.inicio ? 1 : -1)),
    [agendamentos]
  );

  useEffect(() => {
    if (barbeiroId && data && token) {
      carregarAgendamentos();
    }
  }, [barbeiroId, carregarAgendamentos, data, token]);

  if (!token) {
    return <AdminLogin onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0503] text-amber-50">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-4 lg:px-8">
        <AdminHeader online={online} onRefresh={carregarAgendamentos} onLogout={logout} />

        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-amber-200/70">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>Visual moderno com ações rápidas e feedback imediato.</span>
        </div>

        <FiltersBar
          barbeiroId={barbeiroId}
          data={data}
          barbeiros={barbeiros}
          loading={loading}
          onChangeBarbeiro={(id) => {
            setBarbeiroId(id);
            setAgendamentos([]);
          }}
          onChangeData={setData}
          onBuscar={carregarAgendamentos}
        />

        {erro ? (
          <Card className="mt-4 border border-red-500/50 bg-red-500/10 p-4 text-red-100">
            <p className="font-semibold">{erro}</p>
          </Card>
        ) : null}

        {loading ? (
          <div className="mt-6 grid gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl bg-amber-50/5" />
            ))}
          </div>
        ) : agendamentosOrdenados.length ? (
          <div className="mt-6 space-y-4">
            <AgendamentosTable
              itens={agendamentosOrdenados}
              onStatusChange={handleStatusChange}
              onSelect={(agendamento) => setSelected(agendamento)}
            />
            <AgendamentosCards
              itens={agendamentosOrdenados}
              onStatusChange={handleStatusChange}
              onSelect={(agendamento) => setSelected(agendamento)}
            />
          </div>
        ) : (
          <Card className="mt-8 border border-[#6e2317]/60 bg-black/60 p-8 text-center shadow-lg shadow-black/40">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
              <CalendarX2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Nenhum agendamento para este dia</h3>
            <p className="mt-2 text-sm text-amber-200/80">
              Use os filtros acima para escolher outra data ou barbeiro. Mantemos tudo sincronizado automaticamente.
            </p>
            <Button variant="secondary" onClick={carregarAgendamentos} className="mt-4">
              Recarregar
            </Button>
          </Card>
        )}
      </div>

      <AgendamentoDetailsDrawer
        open={Boolean(selected)}
        agendamento={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
