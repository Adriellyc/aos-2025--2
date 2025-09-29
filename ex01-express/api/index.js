import "dotenv/config";
import cors from "cors";
import express from "express";

import models, { sequelize } from "./models";
import routes from "./routes";

const app = express();
app.set("trust proxy", true);

// CORREÇÃO: Simplificar CORS para permitir todas as origens (ideal para testes)
app.use(cors()); 

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para injetar Models e Contexto (manter por enquanto)
app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.User.findByPk(1), // Fixando o usuário logado para simulação
  };
  next();
});

// Rotas
app.use("/", routes.root);
app.use("/session", routes.session);
app.use("/users", routes.user);
app.use("/messages", routes.message);

const port = process.env.PORT ?? 3000;
const eraseDatabaseOnSync = process.env.ERASE_DATABASE === "true";

// Iniciar Servidor e Sincronizar Banco
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await createUsersWithMessages(); // Garantindo que a população ocorra antes de listen
  }

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
});

// Seeding Function
const createUsersWithMessages = async () => {
  await models.User.create(
    {
      name: "rwieruch", // CORRIGIDO: Usando 'name' (ou mude para 'username' no modelo)
      email: "rwieruch@email.com",
      messages: [
        {
          text: "Published the Road to learn React",
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
  // ... (Repita para ddavids)
};