async function carregarConfigAgenda(
  barbeiroId: string,
  data: string
): Promise<AgendaConfig> {
  const [y, m, d] = data.split("-").map(Number);

  // JS: 0=domingo | DB: 7=domingo
  const jsDay = new Date(y, m - 1, d).getDay();
  const diaSemana = jsDay === 0 ? 7 : jsDay;

  const { data: config, error } = await supabase
    .from("agenda_config")
    .select("abre, fecha, duracao")
    .eq("barbeiro_id", barbeiroId)
    .eq("dia_semana", diaSemana)
    .single();

  if (error || !config) throw error;
  return config;
}
