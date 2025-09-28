import { Router } from "express";

const router = Router();

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await req.context.models.Message.findAll();
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET a message by ID
router.get("/:messageId", async (req, res) => {
  try {
    const message = await req.context.models.Message.findByPk(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST a new message
router.post("/", async (req, res) => {
  try {
    const newMessage = await req.context.models.Message.create({
      text: req.body.text,
      userId: req.context.me.id,
    });
    // Mensagem de sucesso para a criação
    return res.status(201).json({ 
      message: "Mensagem criada com sucesso!",
      data: newMessage 
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE a message by ID
router.delete("/:messageId", async (req, res) => {
  try {
    const result = await req.context.models.Message.destroy({
      where: { id: req.params.messageId },
    });
    if (result === 0) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;