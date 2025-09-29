import { Router } from "express";

const router = Router();

export default (models) => {
  // LISTAR todas as mensagens - Status 200
  router.get("/", async (req, res) => {
    try {
      const messages = await models.Message.findAll({ include: models.User });
      // Explicitando o status 200
      res.status(200).json(messages); 
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // BUSCAR mensagem por ID - Status 200 ou 404
  router.get("/:id", async (req, res) => {
    try {
      const message = await models.Message.findByPk(req.params.id, { include: models.User });
      if (!message) return res.status(404).json({ error: "Mensagem não encontrada" });
      // Explicitando o status 200
      res.status(200).json(message); 
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // CRIAR nova mensagem - Status 201 ou 400
  router.post("/", async (req, res) => {
    try {
      // CORREÇÃO 1: Pegar 'text' e 'userId' do corpo (req.body)
      const { text, userId } = req.body; 

      // CORREÇÃO 2: Adicionar validação de dados ausentes (Status 400)
      if (!text || !userId) {
         return res.status(400).json({ error: "O texto da mensagem e o ID do usuário são obrigatórios" });
      }

      const message = await models.Message.create({
        text: text,
        // CORREÇÃO 3: Usar o userId do corpo em vez de req.context.me.id
        userId: userId, 
      });
      
      // Status 201 para criação bem-sucedida
      res.status(201).json(message); 
    } catch (err) {
      // Status 500 para falha no servidor/banco
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // ATUALIZAR mensagem - Status 200 ou 404
  router.put("/:id", async (req, res) => {
    try {
      const message = await models.Message.findByPk(req.params.id);
      if (!message) return res.status(404).json({ error: "Mensagem não encontrada" });

      await message.update({ text: req.body.text });
      // Explicitando o status 200
      res.status(200).json(message); 
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // DELETAR mensagem - Status 204 ou 404
  router.delete("/:id", async (req, res) => {
    try {
      const message = await models.Message.findByPk(req.params.id);
      if (!message) return res.status(404).json({ error: "Mensagem não encontrada" });

      await message.destroy();
      // Status 204 para sucesso sem conteúdo
      res.status(204).send(); 
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  return router;
};