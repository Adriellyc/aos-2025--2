import express from "express";
import {
  listarTarefas,
  criarTarefa,
  obterTarefa,
  atualizarTarefa,
  deletarTarefa
} from "../controllers/tarefasController.js";

const router = express.Router();

router.get("/", listarTarefas);
router.post("/", criarTarefa);
router.get("/:objectId", obterTarefa);
router.put("/:objectId", atualizarTarefa);
router.delete("/:objectId", deletarTarefa);

export default router;