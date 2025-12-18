import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import type { Agendamento, Status } from "@/lib/adminApi";
import { CheckCircle2, Clock4, Phone, Scissors, User, UserRoundX } from "lucide-react";
import { memo } from "react";
import { statusConfig } from "./AgendamentosTable";

interface AgendamentoDetailsDrawerProps {
  open: boolean;
  agendamento?: Agendamento | null;
  onClose: () => void;
  onStatusChange: (id: number, status: Status) => void;
}

function AgendamentoDetailsDrawer({ open, agendamento, onClose, onStatusChange }: AgendamentoDetailsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DrawerContent className="border border-[#6e2317]/60 bg-[#0f0806] text-amber-50">
        <DrawerHeader>
          <DrawerTitle className="text-left text-2xl font-black">Detalhes do agendamento</DrawerTitle>
          <DrawerDescription className="text-left text-amber-200/70">
            Confirme ou cancele diretamente por aqui. As mudanças são aplicadas imediatamente.
          </DrawerDescription>
        </DrawerHeader>
        {agendamento ? (
          <div className="space-y-4 px-4 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={`text-xs font-semibold ${statusConfig[agendamento.status]}`}>
                {agendamento.status}
              </Badge>
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-100">
                {agendamento.data}
              </span>
            </div>
            <div className="space-y-3 rounded-xl border border-[#6e2317]/60 bg-black/40 p-4 shadow-inner">
              <InfoRow icon={<Clock4 className="h-4 w-4" />} label="Horário" value={`${agendamento.inicio} — ${agendamento.fim}`} />
              <Separator className="bg-[#6e2317]/40" />
              <InfoRow icon={<User className="h-4 w-4" />} label="Cliente" value={agendamento.cliente} />
              <Separator className="bg-[#6e2317]/40" />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Telefone" value={agendamento.telefone} />
              <Separator className="bg-[#6e2317]/40" />
              <InfoRow icon={<Scissors className="h-4 w-4" />} label="Serviço" value={agendamento.servico} />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                size="lg"
                className="w-full gap-2 border border-emerald-500/40 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25"
                onClick={() => onStatusChange(agendamento.id, "confirmado")}
              >
                <CheckCircle2 className="h-4 w-4" /> Confirmar
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border border-red-500/50 text-red-100 hover:bg-red-500/10"
                onClick={() => onStatusChange(agendamento.id, "cancelado")}
              >
                <UserRoundX className="h-4 w-4" /> Cancelar
              </Button>
            </div>
          </div>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

const InfoRow = memo(function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-amber-50">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300/70">{label}</p>
        <p className="text-base font-semibold text-amber-50">{value}</p>
      </div>
    </div>
  );
});

export default memo(AgendamentoDetailsDrawer);
