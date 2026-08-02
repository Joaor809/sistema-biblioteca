import formatarData from "../actions/formatarData.js"

async function buscarLivros() {
    const response = await fetch("http://localhost:3000/books");
    const dados = await response.json();
    const selectLivro = document.querySelector("#livro");

    dados.forEach(dado => {
        const option = document.createElement("option");
        option.value = dado.id;
        option.textContent = dado.titulo;
        selectLivro.appendChild(option);
    });
}
async function buscarLeitores() {
    const response = await fetch("http://localhost:3000/readers");
    const dados = await response.json();
    const selectLivro = document.querySelector("#leitor");

    dados.forEach(dado => {
        const option = document.createElement("option");
        option.value = dado.id;
        option.textContent = dado.nome;
        selectLivro.appendChild(option);
    });
}
buscarLeitores();
buscarLivros();


const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const livro_id = Number(document.getElementById("livro").value);
    const leitor_id = Number(document.getElementById("leitor").value);
    const data_emprestimo = document.getElementById("data_emprestimo").value;
    const data_devolucao = document.getElementById("data_devolucao").value;

    if (livro_id === "" || leitor_id === "" || data_emprestimo === "" || data_devolucao === "") {
        alert("Preencha todos os campos!")
    } else {
        const response = await fetch("http://localhost:3000/loan", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                livro_id,
                leitor_id,
                data_emprestimo,
                data_devolucao
            })
        });
        const dados = await response.json();
        form.reset();
    }
});


const listLoan = document.querySelector("#lista-emprestimos")
async function buscarEmprestimos() {
    const response = await fetch("http://localhost:3000/loan");
    const dados = await response.json();

    criarLinhaEmprestimo(dados);
}
function criarLinhaEmprestimo(dados) {
    dados.forEach(emprestimo => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <td>${emprestimo.titulo}</td>
            <td>${emprestimo.nome}</td>
            <td>${formatarData(emprestimo.data_emprestimo)}</td>
            <td>${formatarData(emprestimo.data_devolucao)}</td>
            <td>${emprestimo.status.charAt(0).toUpperCase() + emprestimo.status.slice(1)}</td>
            <td>${emprestimo.status == "Emprestado" ? "" : `<button id='devolver' onclick='alterarStatus(${id}'><i class='bi bi-check'></i> Devolver</button>`}</td>
        `;
        listLoan.appendChild(tableRow)
    });
}
buscarEmprestimos();

async function alterarStatus(id) {
    const response = await fetch(`http://localhost:3000/loan/${id}`, {
        method: "PUT"
    });
    const dados = await response.json();
    alert(dados.message);
    buscarEmprestimos();
}