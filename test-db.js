require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.POSTGRES_URL
});

async function testConnection() {
  try {
    await client.connect();
    console.log("Conexão com o Neon bem-sucedida!");
  } catch (err) {
    console.error("Erro ao conectar:", err);
  } finally {
    await client.end();
  }
}

testConnection();