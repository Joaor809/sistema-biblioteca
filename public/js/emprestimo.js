import formatarData from "../actions/formatarData.js";
const diasParaDevolucao = 14;


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
    const selectLeitor = document.querySelector("#leitor");
    dados.forEach(dado => {
        const option = document.createElement("option");
        option.value = dado.id;
        option.textContent = dado.nome;
        selectLeitor.appendChild(option);
    });
}


buscarLeitores();
buscarLivros();


const campoDataEmprestimo = document.getElementById("data_emprestimo");
const campoDataDevolucao = document.getElementById("data_devolucao");

campoDataEmprestimo.addEventListener("input", (event) => {
    const dataEmprestimo = event.target.value;
    if (!dataEmprestimo) {
        campoDataDevolucao.value = "";
        return;
    }
    const data = new Date(dataEmprestimo + "T00:00:00");
    data.setDate(data.getDate() + diasParaDevolucao);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    campoDataDevolucao.value = `${ano}-${mes}-${dia}`;
});


const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const livro_id = Number(document.getElementById("livro").value);
    const leitor_id = Number(document.getElementById("leitor").value);

    const data_emprestimo = document.getElementById("data_emprestimo").value;

    const data_devolucao = document.getElementById("data_devolucao").value;
    if (!livro_id || !leitor_id || !data_emprestimo || !data_devolucao) {
        alert("Preencha todos os campos!");
        return;
    }

    const response = await fetch("http://localhost:3000/loan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            livro_id,
            leitor_id,
            data_emprestimo,
            data_devolucao
        })
    });
    const dados = await response.json();
    alert(dados.message);
    form.reset();
    buscarEmprestimos();
});


const listLoan = document.querySelector("#lista-emprestimos");

async function buscarEmprestimos() {
    const response = await fetch("http://localhost:3000/loan");
    const dados = await response.json();
    listLoan.innerHTML = "";
    if (dados.length === 0) {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <td colspan="6">
                Nenhum empréstimo registrado
            </td>
        `;
        listLoan.appendChild(tableRow);

    } else {
        criarLinhaEmprestimo(dados);
    }
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
            <td>${emprestimo.status.toLowerCase() === "emprestado" ? `<button type="button" class="btn-devolver"><i class="bi bi-check"></i> Devolver</button>` : `<button type="button" class="btn-detalhes">Gerar Comprovante</button>`}</td>
        `;
        listLoan.appendChild(tableRow);

        if (emprestimo.status.toLowerCase() === "emprestado") {
            const btnDevolver = tableRow.querySelector(".btn-devolver");
            btnDevolver.addEventListener("click", () => alterarStatus(emprestimo.id));
        } else {
            const btnComprovante = tableRow.querySelector(".btn-detalhes");
            btnComprovante.addEventListener("click", () => {
                window.open(`http://localhost:3000/loan/${emprestimo.id}/comprovante`, "_blank");
            });
        }
    });
}

async function alterarStatus(id) {
    const response = await fetch(
        `http://localhost:3000/loan/${id}`,
        {
            method: "PUT"
        }
    );
    const dados = await response.json();
    alert(dados.message);
    buscarEmprestimos();
    document.activeElement.blur();
}

buscarEmprestimos();
