import express from "express";
import cors from "cors";
import conn from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express.Router();
app.use(cors());

app.post("/register", async (req, res) => {
    const { title, author, year, publisher } = req.body;

    const sqlRegister = "INSERT INTO livros(titulo, autor, ano, publisher) VALUES (?, ?, ?, ?)";
    try{
        await conn.query(sqlRegister, [title, author, year, publisher]);
        res.status(200).json({
            success: true,
            message: "Livro cadastrado com sucesso"
        });
    } catch(error){
        console.error(error);
    }
});
app.put("/livros/:id/emprestar", (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    const sql = ``
});

app.put("/livros/:id/devolver", (req, res) => {

});

app.listen(process.env.PORTA, () => {
    console.log("Servidor rodando");
});