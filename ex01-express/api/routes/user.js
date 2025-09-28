import { Router } from "express";

const router = Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await req.context.models.User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET a user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST a new user
router.post("/", async (req, res) => {
  try {
    const newUser = await req.context.models.User.create({
      username: req.body.username,
      // Você pode precisar adicionar outros campos aqui
    });
    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      data: newUser
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT to update a user by ID
router.put("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    await user.update({
      username: req.body.username,
      // Atualize outros campos conforme necessário
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE a user by ID
router.delete("/:userId", async (req, res) => {
  try {
    const result = await req.context.models.User.destroy({
      where: { id: req.params.userId },
    });
    if (result === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;