import express from "express";
import cors from "cors";
import conn from "./db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import gerarComprovante from "./public/actions/gerarComprovante.js";

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


app.get("/leitores", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "cadastroLeitor.html"))
})

app.get("/livros", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "cadastroLivros.html"));
})

app.get("/emprestimos", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "emprestimos.html"));
})


app.post("/readers", async (req, res) => {
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
            message: "Erro ao cadastrar leitor"
        });
    }
})

app.post("/books", async (req, res) => {
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

app.post("/loan", async (req, res) => {
    const { livro_id, leitor_id, data_emprestimo, data_devolucao } = req.body;

    try{
        const sql = "INSERT INTO emprestimos(livro_id, leitor_id, data_emprestimo, data_devolucao) VALUES(?, ?, ?, ?)";
        
        await conn.query(sql, [livro_id, leitor_id, data_emprestimo, data_devolucao]);
        res.status(200).json({
            success: true,
            message: "Empréstimo registrado com sucesso"
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Erro ao registrar empréstimo"
        })
    }
});

app.get("/loan", async (req, res) => {
    try{
        const sql = "select l.id, b.titulo, r.nome, l.data_emprestimo, l.data_devolucao, l.status from emprestimos l inner join livros b on l.livro_id = b.id inner join leitores r on l.leitor_id = r.id;";

        const [emprestimos] = await conn.query(sql);

        res.send(emprestimos)
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Erro ao buscar empréstimos"
        })
    }
})

app.put("/loan/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try{
        const sql = "UPDATE emprestimos SET status = 'devolvido' WHERE id = ?";
        await conn.query(sql, [id]);
        res.json({
            success: true,
            message: "Livro devolvido!"
        });
    } catch(error) {
        console.log(error)
    }
})

app.get("/loan/:id/comprovante", async (req, res) => {
    try {
        const { id } = req.params;
        const [dados] = await conn.query(`
            SELECT
                emprestimos.id,
                livros.titulo,
                leitores.nome,
                emprestimos.data_emprestimo,
                emprestimos.data_devolucao
            FROM emprestimos
            INNER JOIN livros
                ON emprestimos.livro_id = livros.id
            INNER JOIN leitores
                ON emprestimos.leitor_id = leitores.id
            WHERE emprestimos.id = ?
        `, [id]);
        if (dados.length === 0) {
            return res.status(404).json({
                message: "Empréstimo não encontrado."
            });
        }
        const emprestimo = dados[0];
        const arquivo = gerarComprovante(emprestimo);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="comprovante.docx"`
        );
        res.send(arquivo);
    } catch (error) {
        console.error("Erro ao gerar comprovante:", error);
        res.status(500).json({
            message: "Erro ao gerar o comprovante."
        });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});