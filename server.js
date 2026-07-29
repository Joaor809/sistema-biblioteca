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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.use("/public", express.static(path.join(__dirname, "public")));


app.get("/cadastroLeitores", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "cadastroLeitor.html"))
})

app.get("/cadastroLivros", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "cadastroLivros.html"));
})


app.post("/registerReader", async (req, res) => {
    const { name, email, telefoneNumeros, cpfNumeros } = req.body;

    const sql = "INSERT INTO leitores(nome, telefone, email, cpf) VALUES (?, ?, ?, ?)";
    try{
        await conn.query(sql, [name, telefoneNumeros, email, cpfNumeros]);
        res.status(200).json({
            success: true,
            mensagem: "Leitor cadastrado com sucesso"
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Erro ao cadastrar livro"
        });
    }
})

app.post("/registerBook", async (req, res) => {
    const { title, author, year, publisher } = req.body;

    const sql = "INSERT INTO livros(titulo, autor, ano, editora) VALUES (?, ?, ?, ?)";
    try{
        await conn.query(sql, [title, author, year, publisher]);
        res.status(200).json({
            success: true,
            message: "Livro cadastrado com sucesso"
        });
        console.log("Livro cadastrado");
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erro ao cadastrar livro"
        });
    }
});

app.get("/readers", async (req, res) => {
    const sql = "SELECT * FROM leitores";
    try{
        const [livros] = await conn.query(sql);
        res.send(livros);
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Erro ao procurar livros"
        });
    }
});

app.get("/books", async (req, res) => {
    const sql = "SELECT * FROM livros";
    try{
        const [livros] = await conn.query(sql);
        res.send(livros);
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Erro ao procurar livros"
        });
    }
});

app.delete("/readers/:id", async (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM leitores WHERE id = ?";

    try{
        await conn.query(sql, [id]);
        res.status(200).json({
            success: true,
            message: "Leitor deletado"
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Erro ao procurar livros"
        });
    }
});

app.get("/readers/:id", async (req, res) => {
    const { id } = req.params;
    
    try{
        const [dados] = await conn.query("SELECT * FROM leitores WHERE id = ?", [id]);
        res.send(dados);
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Erro ao buscar livro"
        });
    }
})

app.put("/readersEdit/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, cpf } = req.body;

    await conn.query(
        `UPDATE leitor
         SET nome = ?, email = ?, telefone = ?, cpf = ?
         WHERE id = ?`,
        [nome, email, telefone, cpf, id]
    );
    res.json({
        success: true,
        message: "Livro atualizado com sucesso."
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});