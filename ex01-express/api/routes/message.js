import { Router } from "express";

const router = Router();

export default (models) => {
  // LISTAR todas as mensagens
  router.get("/", async (req, res) => {
    try {
      const messages = await models.Message.findAll({ include: models.User });
      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // BUSCAR mensagem por ID
  router.get("/:id", async (req, res) => {
    try {
      const message = await models.Message.findByPk(req.params.id, { include: models.User });
      if (!message) return res.status(404).json({ error: "Mensagem não encontrada" });
      res.json(message);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // CRIAR nova mensagem
  router.post("/", async (req, res) => {
    try {
      const message = await models.Message.create({
        text: req.body.text,
        userId: req.context.me.id,
      });
      res.status(201).json(message);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // ATUALIZAR mensagem
  router.put("/:id", async (req, res) => {
    try {
      const message = await models.Message.findByPk(req.params.id);
      if (!message) return res.status(404).json({ error: "Mensagem não encontrada" });

      await message.update({ text: req.body.text });
      res.json(message);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // DELETAR mensagem
  router.delete("/:id", async (req, res) => {
    try {
      const message = await models.Message.findByPk(req.params.id);
      if (!message) return res.status(404).json({ error: "Mensagem não encontrada" });

      await message.destroy();
      res.status(204).send(); // sucesso sem conteúdo
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  return router;
};