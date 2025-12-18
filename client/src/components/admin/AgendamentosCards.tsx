import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Agendamento, Status } from "@/lib/adminApi";
import { CheckCircle2, Phone, UserRound, UserRoundX } from "lucide-react";
import { memo } from "react";
import { statusConfig } from "./AgendamentosTable";

interface AgendamentosCardsProps {
  itens: Agendamento[];
  onStatusChange: (id: number, status: Status) => void;
  onSelect: (agendamento: Agendamento) => void;
}

function AgendamentosCards({ itens, onStatusChange, onSelect }: AgendamentosCardsProps) {
  if (!itens.length) return null;

  return (
    <div className="grid gap-3 md:hidden">
      {itens.map((item) => (
        <Card
          key={item.id}
          className="flex flex-col gap-3 border border-[#6e2317]/60 bg-[#0f0806] p-4 text-amber-50 shadow-lg shadow-black/40"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1" onClick={() => onSelect(item)}>
              <p className="text-sm uppercase tracking-[0.18em] text-amber-300/80">{item.inicio} — {item.fim}</p>
              <p className="text-xl font-bold leading-tight">{item.cliente}</p>
              <div className="flex items-center gap-2 text-sm text-amber-200/80">
                <UserRound className="h-4 w-4" />
                <span>{item.servico}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-200/80">
                <Phone className="h-4 w-4" />
                <span>{item.telefone}</span>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs font-semibold ${statusConfig[item.status]}`}>
              {item.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="flex-1 gap-2 border border-emerald-500/40 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
              onClick={() => onStatusChange(item.id, "confirmado")}
            >
              <CheckCircle2 className="h-4 w-4" /> Confirmar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2 border border-red-500/40 text-red-100 hover:bg-red-500/10"
              onClick={() => onStatusChange(item.id, "cancelado")}
            >
              <UserRoundX className="h-4 w-4" /> Cancelar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default memo(AgendamentosCards);
