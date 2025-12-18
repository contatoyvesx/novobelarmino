function horariosRoute(app: Express) {
  app.get("/api/horarios", async (req: Request, res: Response) => {
    const parsed = horariosQuerySchema.safeParse(req.query);

    // ⚠️ SEMPRE array
    if (!parsed.success) {
      return res.json([]);
    }

    const { data, barbeiro_id } = parsed.data;

    try {
      const config = await carregarConfigAgenda(barbeiro_id, data);
      const ag = await carregarAgendamentos(data, barbeiro_id);
      const bl = await carregarBloqueios(data, barbeiro_id);

      const base = gerarHorarios(config);
      const livres = removerOcupados(
        removerOcupados(base, ag, config.duracao),
        bl,
        config.duracao
      );

      // 👇 ARRAY PURO
      return res.json(livres);
    } catch (e: any) {
      console.error("Erro ao buscar horários:", e?.message);
      return res.json([]);
    }
  });
}
