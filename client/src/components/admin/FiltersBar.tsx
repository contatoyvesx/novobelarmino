import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Barbeiro } from "@/lib/adminApi";
import { CalendarDays, Search } from "lucide-react";
import { memo } from "react";

interface FiltersBarProps {
  barbeiroId: string;
  data: string;
  barbeiros: Barbeiro[];
  loading: boolean;
  onChangeBarbeiro: (id: string) => void;
  onChangeData: (data: string) => void;
  onBuscar: () => void;
}

function FiltersBar({ barbeiroId, data, barbeiros, loading, onChangeBarbeiro, onChangeData, onBuscar }: FiltersBarProps) {
  return (
    <Card className="border border-[#6e2317]/60 bg-black/50 p-4 text-amber-50 shadow-lg shadow-black/50">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_auto] lg:items-end">
        <div className="space-y-2">
          <Label htmlFor="barbeiro" className="text-sm font-semibold text-amber-100">
            Selecione o barbeiro
          </Label>
          <Select value={barbeiroId} onValueChange={onChangeBarbeiro}>
            <SelectTrigger id="barbeiro" className="h-12 border-[#6e2317]/70 bg-black/60 text-left text-base text-amber-50">
              <SelectValue placeholder="Escolha um barbeiro" />
            </SelectTrigger>
            <SelectContent className="border-[#6e2317]/60 bg-[#0f0806] text-amber-50">
              {barbeiros.map((b) => (
                <SelectItem key={b.id} value={b.id} className="text-sm">
                  {b.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="data" className="text-sm font-semibold text-amber-100">
            Data
          </Label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400" />
            <Input
              id="data"
              type="date"
              value={data}
              onChange={(e) => onChangeData(e.target.value)}
              className="h-12 border-[#6e2317]/70 bg-black/60 pl-11 text-base text-amber-50"
            />
          </div>
        </div>
        <div className="flex items-end">
          <Button
            onClick={onBuscar}
            disabled={loading || !barbeiroId || !data}
            className="h-12 w-full gap-2 bg-gradient-to-r from-[#d9a66a] to-[#8c4b2f] text-base font-semibold text-black shadow-lg hover:from-[#e6b778] hover:to-[#a05939]"
          >
            <Search className="h-4 w-4" /> {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default memo(FiltersBar);
