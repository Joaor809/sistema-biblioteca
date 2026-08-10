import express from "express";
import cors from "cors";
import conn from "./db.js";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import gerarComprovante from "./public/actions/gerarComprovante.js";
import isAuthenticated from "./auth/middlewares/verificarLogin.js";
import session from "express-session"

dotenv.config({ quiet: true });

const app = express();
app.use(express.json());
app.use(cors());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60
        }
    })
);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.get("/leitores", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "cadastroLeitor.html"));
});

app.get("/livros", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "cadastroLivros.html"));
});

app.get("/emprestimos", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "emprestimos.html"));
});

app.post("/readers", async (req, res) => {
  const { name, email, telefoneNumeros, cpfNumeros } = req.body;

  if (
    ![name, email, telefoneNumeros, cpfNumeros].every(
      (campo) => typeof campo === "string" && campo.trim(),
    )
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Preencha todos os dados do leitor." });
  }

  const sql =
    "INSERT INTO leitores(nome, telefone, email, cpf) VALUES (?, ?, ?, ?)";
  try {
    await conn.query(sql, [name, telefoneNumeros, email, cpfNumeros]);
    res.status(201).json({
      success: true,
      mensagem: "Leitor cadastrado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao cadastrar leitor:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro ao cadastrar leitor",
    });
  }
});

app.post("/books", async (req, res) => {
  const { title, author, year, publisher } = req.body;

  if (
    ![title, author, publisher].every(
      (campo) => typeof campo === "string" && campo.trim(),
    ) ||
    !Number.isInteger(Number(year)) ||
    Number(year) <= 0
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Preencha todos os dados do livro corretamente.",
      });
  }

  const sql =
    "INSERT INTO livros(titulo, autor, ano, editora) VALUES (?, ?, ?, ?)";
  try {
    await conn.query(sql, [title, author, year, publisher]);
    res.status(201).json({
      success: true,
      message: "Livro cadastrado com sucesso",
    });
    console.log("Livro cadastrado");
  } catch (error) {
    console.error("Erro ao cadastrar livro:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro ao cadastrar livro",
    });
  }
});

app.get("/readers", async (req, res) => {
  const sql = "SELECT * FROM leitores";
  try {
    const [leitores] = await conn.query(sql);
    res.json(leitores);
  } catch (error) {
    console.error("Erro ao buscar leitores:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar leitores",
    });
  }
});

app.get("/books", async (req, res) => {
  const sql = "SELECT * FROM livros";
  try {
    const [livros] = await conn.query(sql);
    res.json(livros);
  } catch (error) {
    console.error("Erro ao buscar livros:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro ao procurar livros",
    });
  }
});

app.delete("/readers/:id", async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM leitores WHERE id = ?";

  try {
    await conn.query(sql, [id]);
    res.status(200).json({
      success: true,
      message: "Leitor deletado",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao procurar livros",
    });
  }
});

app.get("/readers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [dados] = await conn.query("SELECT * FROM leitores WHERE id = ?", [
      id,
    ]);
    res.send(dados);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar livro",
    });
  }
});

app.post("/loan", async (req, res) => {
  const { livro_id, leitor_id, data_emprestimo, data_devolucao } = req.body;

  if (
    ![livro_id, leitor_id].every(
      (id) => Number.isInteger(Number(id)) && Number(id) > 0,
    ) ||
    !data_emprestimo ||
    !data_devolucao
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Preencha todos os dados do empréstimo.",
      });
  }

  try {
    const sql =
      "INSERT INTO emprestimos(livro_id, leitor_id, data_emprestimo, data_devolucao) VALUES(?, ?, ?, ?)";

    await conn.query(sql, [
      livro_id,
      leitor_id,
      data_emprestimo,
      data_devolucao,
    ]);
    res.status(201).json({
      success: true,
      message: "Empréstimo registrado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao registrar empréstimo:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro ao registrar empréstimo",
    });
  }
});

app.get("/loan", async (req, res) => {
  try {
    const sql =
      "select l.id, b.titulo, r.nome, l.data_emprestimo, l.data_devolucao, l.status from emprestimos l inner join livros b on l.livro_id = b.id inner join leitores r on l.leitor_id = r.id;";

    const [emprestimos] = await conn.query(sql);

    res.json(emprestimos);
  } catch (error) {
    console.error("Erro ao buscar empréstimos:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar empréstimos",
    });
  }
});

app.put("/loan/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const sql = "UPDATE emprestimos SET status = 'devolvido' WHERE id = ?";
    await conn.query(sql, [id]);
    res.json({
      success: true,
      message: "Livro devolvido!",
    });
  } catch (error) {
    console.error("Erro ao devolver livro:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Erro ao registrar devolução." });
  }
});

app.get("/loan/:id/comprovante", async (req, res) => {
  try {
    const { id } = req.params;
    const [dados] = await conn.query(
      `
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
        `,
      [id],
    );
    if (dados.length === 0) {
      return res.status(404).json({
        message: "Empréstimo não encontrado.",
      });
    }
    const emprestimo = dados[0];
    const arquivo = gerarComprovante(emprestimo);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="comprovante.docx"`,
    );
    res.send(arquivo);
  } catch (error) {
    console.error("Erro ao gerar comprovante:", error);
    res.status(500).json({
      message: "Erro ao gerar o comprovante.",
    });
  }
});

app.get("/librarian", (req, res) => {
  res.sendFile(path.join(__dirname, "auth", "cadastro.html"));
});

app.post("/librarian", async (req, res) => {
  const { name, email, senha, cpfNumeros, telefoneNumeros } = req.body || {};

  const sql = "INSERT INTO bibliotecarios(nome, telefone, cpf, email, senha) VALUES (?, ?, ?, ?, ?)";
  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    
    await conn.query(sql, [name, telefoneNumeros, cpfNumeros, email, senhaHash]);
    res.status(201).json({
      success: true,
      message: "Bibliotecário cadastrado com sucesso",
    });
    console.log("Bibliotecário cadastrado");
  } catch (error) {
    console.error("Erro ao cadastrar bibliotecário:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro ao cadastrar bibliotecário",
    });
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "auth", "login.html"))
})

app.post("/login", async (req, res) => {
  const { cpfNumeros, senha } = req.body || {};

  if (!cpfNumeros || !senha) {
    return res.status(400).json({
      success: false,
      message: "CPF e senha são obrigatórios.",
    });
  }

  try {
    const sql = "SELECT * FROM bibliotecarios WHERE cpf = ?";
    const [resultado] = await conn.query(sql, [cpfNumeros]);

    if (resultado.length === 0) {
      return res.status(401).json({ success: false, message: "CPF ou senha inválidos." });
    }

    if (resultado.length > 0){
      const user = resultado[0];
      const senhaValida = await bcrypt.compare(senha, user.senha);
      if(!senhaValida){
        return res.status(401).json({success: false, message: "CPF ou senha inválidos."});
      } else{
        req.session.login = true;
        req.session.userId = user.id;
        req.session.nome = user.nome;
        req.session.email = user.email;
        req.session.cpf = user.cpf;
        req.session.telefone = user.telefone;
        return req.session.save((erro) => {
          if (erro) {
            console.error("Erro ao salvar sessão:", erro.message);
            return res.status(500).json({
              success: false,
              message: "Erro ao iniciar a sessão.",
            });
          }

          return res.json({ success: true, redirect: "/" });
        });
      }
    }

  } catch(error){
    console.error("Erro ao buscar bibliotecário:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar bibliotecário",
    });
  }

});
app.get("/teste", (req, res) => {
  res.send(`<ul>
      <li>${req.session.nome}</li>
      <li>${req.session.email}</li>
      <li>${req.session.telefone}</li>
    </ul>`);
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
