import { useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const formatDatePtBr = (date: Date) =>
  date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatDateApi = (date: Date) => date.toISOString().slice(0, 10);

export default function Agendar() {
  const dataHoje = useMemo(() => formatDateApi(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<string>(dataHoje);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedHora, setSelectedHora] = useState("");
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const BARBEIRO_ID = "be3c5248-746f-44ed-8b3c-73ca71a40703";
  const API_URL = import.meta.env.VITE_API_URL || "";

  const servicos = useMemo(
    () => [
      "Corte de cabelo",
      "Barba",
      "Sobrancelha",
      "Hidratação capilar",
      "Limpeza de pele / black mask",
      "Camuflagem de fios brancos",
    ],
    []
  );

  const dataParaExibicao = useMemo(() => {
    if (!selectedDate) return "";
    const parsed = new Date(`${selectedDate}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? "" : formatDatePtBr(parsed);
  }, [selectedDate]);

  const toggleServico = (servico: string) => {
    setServicosSelecionados((prev) =>
      prev.includes(servico)
        ? prev.filter((s) => s !== servico)
        : [...prev, servico]
    );
    setMensagemErro("");
    setMensagemSucesso("");
  };

  const servicosFormatados = servicosSelecionados.join(", ");

  const buscarHorarios = useCallback(
    async (data: string) => {
      if (!data) return;

      setLoading(true);
      setMensagemErro("");
      setMensagemSucesso("");
      setSelectedHora("");
      setHorarios([]);

      try {
        const res = await fetch(
          `${API_URL}/horarios?data=${encodeURIComponent(
            data
          )}&barbeiro_id=${BARBEIRO_ID}`,
          { cache: "no-store" }
        );

        const json = await res.json();
        const lista = Array.isArray(json) ? json : [];

        setHorarios(lista);

  {!loading && horarios.length === 0 && (
    <p className="text-gray-400 text-sm">
      Nenhum horário disponível para esta data.
    </p>
  )}

      } catch {
        setMensagemErro("Erro ao buscar horários.");
      } finally {
        setLoading(false);
      }
    },
    [API_URL, BARBEIRO_ID]
  );

  // 🔥 BUSCA AUTOMÁTICA — SEM BOTÃO, SEM DUPLICAÇÃO
  useEffect(() => {
    void buscarHorarios(selectedDate);
  }, [buscarHorarios, selectedDate]);

  async function confirmarAgendamento() {
    if (
      !cliente ||
      !telefone ||
      !servicosSelecionados.length ||
      !selectedHora ||
      !selectedDate
    ) {
      setMensagemErro("Preencha todos os campos.");
      return;
    }

    setSubmitting(true);
    setMensagemErro("");
    setMensagemSucesso("");

    try {
      const res = await fetch(`${API_URL}/agendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente,
          telefone,
          servico: servicosFormatados,
          data: selectedDate,
          hora: selectedHora,
          barbeiro_id: BARBEIRO_ID,
        }),
      });

      const json = await res.json();

      if (res.ok && json.status === "confirmado") {
        const resumo = `Novo agendamento confirmado:\n\n🧔 Cliente: ${cliente}\n📅 Data: ${dataParaExibicao}\n⏰ Hora: ${selectedHora}\n💈 Serviço: ${servicosFormatados}`;

        window.open(
          `https://wa.me/5511952861321?text=${encodeURIComponent(resumo)}`,
          "_blank"
        );

        setMensagemSucesso("Agendamento confirmado com sucesso!");
        setCliente("");
        setTelefone("");
        setServicosSelecionados([]);
        setSelectedHora("");
        buscarHorarios(selectedDate);
      } else {
        setMensagemErro(json.mensagem || "Erro ao confirmar.");
      }
    } catch {
      setMensagemErro("Erro ao enviar agendamento.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#140000] text-white p-4">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-[#D9A66A]">
          Agendar Horário
        </h1>

        <p className="text-center text-gray-300">
          Escolha a data, veja os horários livres e confirme seu atendimento.
        </p>

        {/* DATA */}
        <div className="space-y-2">
          <label className="text-[#D9A66A] font-semibold text-sm">
            Data do atendimento
          </label>
          <input
            type="date"
            min={dataHoje}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setMensagemErro("");
              setMensagemSucesso("");
            }}
            className="w-full p-3 rounded bg-[#1b0402] border border-[#6e2317] text-white"
          />
        </div>

        {/* HORÁRIOS */}
        <div className="space-y-3">
          <p className="text-[#D9A66A] font-semibold">Horários disponíveis</p>

          {loading && <p className="text-gray-300 text-sm">Carregando horários…</p>}

          {!loading && horarios.length === 0 && (
            <p className="text-gray-400 text-sm">
              Nenhum horário disponível para esta data.
            </p>
          )}

          {!loading && horarios.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {horarios.map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHora(h)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedHora === h
                      ? "bg-[#D9A66A] text-black"
                      : "bg-[#1b0402] border-[#6e2317] text-[#E8C8A3]"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          )}

          {selectedHora && (
            <p className="text-sm text-[#E8C8A3]">
              Horário escolhido: {selectedHora} — {dataParaExibicao}
            </p>
          )}
        </div>

        {/* SERVIÇOS */}
        <div className="space-y-3">
          <p className="text-[#D9A66A] font-semibold">Serviços</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {servicos.map((servico) => {
              const selecionado = servicosSelecionados.includes(servico);
              return (
                <label
                  key={servico}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition",
                    selecionado
                      ? "border-[#D9A66A] bg-[#26100d]"
                      : "border-[#6e2317] bg-[#1b0402]"
                  )}
                >
                  <Checkbox
                    checked={selecionado}
                    onCheckedChange={() => toggleServico(servico)}
                  />
                  <span className="text-[#E8C8A3]">{servico}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* DADOS */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full p-3 rounded bg-[#1b0402] border border-[#6e2317]"
          />
          <input
            type="tel"
            placeholder="Telefone com DDD"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full p-3 rounded bg-[#1b0402] border border-[#6e2317]"
          />
        </div>

        {/* MENSAGENS */}
        {mensagemErro && (
          <p className="text-red-400 text-center">{mensagemErro}</p>
        )}
        {mensagemSucesso && (
          <p className="text-green-400 text-center">{mensagemSucesso}</p>
        )}

        {/* CONFIRMAR */}
        <button
          onClick={confirmarAgendamento}
          className="btn-retro w-full disabled:opacity-60"
          disabled={submitting || loading}
        >
          {submitting ? "Enviando…" : "Confirmar Agendamento"}
        </button>
      </div>
    </div>
  );
}
