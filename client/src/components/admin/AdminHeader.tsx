import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCcw, ShieldCheck, WifiOff } from "lucide-react";
import { memo } from "react";

interface AdminHeaderProps {
  online: boolean | null;
  onRefresh: () => void;
  onLogout: () => void;
}

function AdminHeader({ online, onRefresh, onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-6 border-b border-[#6e2317]/50 bg-black/50 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#d9a66a] to-[#8c4b2f] text-black shadow-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Painel interno</p>
            <h1 className="text-2xl font-black text-amber-50">Admin — Belarmino</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <Badge
            variant="outline"
            className={`rounded-full border px-3 py-1 text-sm font-semibold ${
              online ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-100" : "border-red-500/70 bg-red-500/15 text-red-100"
            }`}
          >
            <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-current" aria-hidden />
            {online === null ? "Checando..." : online ? "Backend online" : "Backend offline"}
          </Badge>
          <Separator orientation="vertical" className="hidden h-6 bg-[#6e2317]/70 lg:block" />
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            className="gap-2 border border-amber-500/30 bg-amber-500/10 text-amber-50 hover:bg-amber-500/20"
          >
            <RefreshCcw className="h-4 w-4" /> Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-red-500/40 text-red-100 hover:bg-red-500/10"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}

export default memo(AdminHeader);
