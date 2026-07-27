import express from "express";
import cors from "cors";
import conn from "./db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "cadastroLivros.html"));
});

app.post("/registerBook", async (req, res) => {
    const { title, author, year, publisher } = req.body;

    const sqlRegister = "INSERT INTO livros(titulo, autor, ano, editora) VALUES (?, ?, ?, ?)";
    try{
        await conn.query(sqlRegister, [title, author, year, publisher]);
        res.status(200).json({
            success: true,
            message: "Livro cadastrado com sucesso"
        });
        console.log("Livro cadastrado");
    } catch (error) {
        console.error(error);
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});