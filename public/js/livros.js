const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("nome").value;
    const author = document.getElementById("autor").value;
    const year = Number(document.getElementById("ano").value);
    const publisher = document.getElementById("editora").value;

    if (title == "") {
        alert("Preencha todos os campos!");
    } else if (author === "") {
        alert("Preencha todos os campos!");
    } else if (year === 0) {
        alert("Preencha todos os campos!");
    } else if (publisher === "") {
        alert("Preencha todos os campos!");
    } else {
        const response = await fetch("http://localhost:3000/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                author,
                year,
                publisher
            })
        });
        const dados = await response.json();
        console.log(dados);
        form.reset();
        buscarLivros();
    }
});

async function buscarLivros() {
    const carregamento = document.querySelector(".loading");
    try {
        const response = await fetch("http://localhost:3000/books");
        const dados = await response.json();

        tableBody.innerHTML = "";
        if (dados.length === 0) {
            tableBody.innerHTML = `
            <tr>
                <td colspan="5">Nenhum livro cadastrado</td>
            </tr>
            `;
        } else {
            criarDado(dados);
        }
    } catch (error) {
        console.log("Erro ao buscar livros");
    } finally {
        carregamento.style.display = "none";
    }
}

const tableBody = document.querySelector(".list-books")
function criarDado(dados) {
    dados.forEach(livro => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
        <td>${livro.id}</td>
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
        <td>${livro.ano}</td>
        <td>${livro.editora}</td>
        `;
        tableBody.appendChild(tableRow);
    });
}
buscarLivros();