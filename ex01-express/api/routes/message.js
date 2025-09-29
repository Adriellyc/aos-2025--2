import { Router } from "express";

const router = Router();

export default (models) => {
  // LISTAR todas as mensagens - Status 200
  router.get("/", async (req, res) => {
    try {
      const messages = await models.Message.findAll({ include: models.User });
      res.status(200).json(messages);
    } catch (err) {
      console.error("Erro ao listar mensagens:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // BUSCAR mensagem por ID - Status 200 ou 404
  router.get("/:id", async (req, res) => {
    try {
      const message = await models.Message.findByPk(req.params.id, { include: models.User });
      if (!message) return res.status(404).json({ error: "Mensagem não encontrada" });
      res.status(200).json(message);
    } catch (err) {
      console.error("Erro ao buscar mensagem:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // CRIAR nova mensagem - Status 201 ou 400
  router.post("/", async (req, res) => {
    try {
      const { text, userId } = req.body;

      // Validação de campos obrigatórios
      if (!text || !userId) {
        return res.status(400).json({ error: "O texto da mensagem e o ID do usuário são obrigatórios" });
      }

      // Verificar se o usuário existe
      const userExists = await models.User.findByPk(userId);
      if (!userExists) {
        return res.status(400).json({ error: "Usuário não existe" });
      }

      const message = await models.Message.create({ text, userId });
      res.status(201).json(message);
    } catch (err) {
      console.error("Erro ao criar mensagem:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // ATUALIZAR mensagem - Status 200 ou 404
  router.put("/:id", async (req, res) => {
    try {
      const message = await models.Message.findByPk(req.params.id);
      if (!message) return res.status(404).json({ error: "Mensagem não encontrada" });

      await message.update({ text: req.body.text });
      res.status(200).json(message);
    } catch (err) {
      console.error("Erro ao atualizar mensagem:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // DELETAR mensagem - Status 204 ou 404
  router.delete("/:id", async (req, res) => {
    try {
      const message = await models.Message.findByPk(req.params.id);
      if (!message) return res.status(404).json({ error: "Mensagem não encontrada" });

      await message.destroy();
      res.status(204).send();
    } catch (err) {
      console.error("Erro ao deletar mensagem:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  return router;
};