import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCcw, ShieldCheck } from "lucide-react";
import { memo } from "react";

interface AdminHeaderProps {
  online: boolean | null;
  onRefresh: () => void;
  onLogout: () => void;
}

function AdminHeader({ online, onRefresh, onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-6 border-b border-[#6e2317]/50 bg-[#140000]/70 px-4 py-3 shadow-[0_10px_40px_-25px_rgba(0,0,0,0.8)] backdrop-blur lg:-mx-8 lg:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#d9a66a]/40 bg-gradient-to-br from-[#2a0906] to-[#0b0503] shadow-lg shadow-black/60">
            <img src="/belarmino-logo.png" alt="Belarmino" className="h-10 w-10 object-contain" />
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-[#d9a66a]/30 ring-offset-2 ring-offset-[#140000]" aria-hidden />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Painel interno</p>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-amber-50">Admin — Belarmino</h1>
              <ShieldCheck className="h-5 w-5 text-[#d9a66a]" aria-hidden />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <Badge
            variant="outline"
            className={`rounded-full border px-3 py-1 text-sm font-semibold backdrop-blur ${
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
