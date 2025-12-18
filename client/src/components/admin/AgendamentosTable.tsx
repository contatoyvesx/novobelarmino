import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Agendamento, Status } from "@/lib/adminApi";
import { CheckCircle2, UserRoundX } from "lucide-react";
import { memo, useMemo } from "react";

interface AgendamentosTableProps {
  itens: Agendamento[];
  onStatusChange: (id: number, status: Status) => void;
  onSelect: (agendamento: Agendamento) => void;
}

const statusConfig: Record<Status, string> = {
  pendente: "border-amber-400/60 bg-amber-400/15 text-amber-100",
  confirmado: "border-emerald-400/60 bg-emerald-400/15 text-emerald-100",
  cancelado: "border-red-400/60 bg-red-400/15 text-red-100",
};

function AgendamentosTable({ itens, onStatusChange, onSelect }: AgendamentosTableProps) {
  const rows = useMemo(() => itens, [itens]);

  if (!rows.length) return null;

  return (
    <div className="hidden overflow-hidden rounded-xl border border-[#6e2317]/60 bg-black/50 shadow-lg shadow-black/40 md:block">
      <Table>
        <TableHeader className="bg-[#1a0f0c]/80">
          <TableRow className="border-[#6e2317]/60">
            <TableHead className="text-amber-100">Horário</TableHead>
            <TableHead className="text-amber-100">Cliente</TableHead>
            <TableHead className="text-amber-100">Telefone</TableHead>
            <TableHead className="text-amber-100">Serviço</TableHead>
            <TableHead className="text-amber-100">Status</TableHead>
            <TableHead className="text-right text-amber-100">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer border-[#6e2317]/40 transition hover:bg-[#1a100d]/80"
              onClick={() => onSelect(item)}
            >
              <TableCell className="font-semibold text-amber-50">{item.inicio} – {item.fim}</TableCell>
              <TableCell className="text-amber-50">{item.cliente}</TableCell>
              <TableCell className="text-amber-50">{item.telefone}</TableCell>
              <TableCell className="text-amber-50">{item.servico}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`text-xs font-semibold ${statusConfig[item.status]}`}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(item.id, "confirmado");
                    }}
                    className="gap-1 border border-emerald-500/40 bg-emerald-500/10 px-3 text-emerald-100 hover:bg-emerald-500/20"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(item.id, "cancelado");
                    }}
                    className="gap-1 border border-red-500/40 bg-red-500/10 px-3 text-red-100 hover:bg-red-500/20"
                  >
                    <UserRoundX className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default memo(AgendamentosTable);
export { statusConfig };
