import formatarTelefone from "./formatarCelular.js";
import formatarCpf from "./formatarCPF.js";
import apagarUser from "./apagarUser.js";

const form = document.querySelector("form");

const telefone = document.getElementById("telefone");
let telefoneNumeros = "";

telefone.addEventListener("input", (event) => {
    telefoneNumeros = event.target.value.replace(/\D/g, "");

    let valor = telefoneNumeros;

    valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

    event.target.value = valor;
});

const cpf = document.getElementById("cpf");
let cpfNumeros = "";
cpf.addEventListener("input", (event) => {
    cpfNumeros = event.target.value.replace(/\D/g, "");

    let valor = cpfNumeros;

    valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    event.target.value = valor;
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    if (name === "") {
        alert("Preencha todos os campos!");
    } else if (email === "") {
        alert("Preencha todos os campos!");
    } else if (telefoneNumeros === "") {
        alert("Preencha todos os campos!");
    } else if (cpfNumeros === "") {
        alert("Preencha todos os campos!");
    } else {
        const response = await fetch("http://localhost:3000/registerReader", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                name,
                email,
                telefoneNumeros,
                cpfNumeros
            })
        });
        const dados = await response.json();
        console.log(dados);
        tableBody.innerHTML = "";
        buscarLeitores();
    }
});


const tableBody = document.querySelector(".list-readers");
async function buscarLeitores() {
    const carregamento = document.querySelector(".loading");

    try {
        const resposta = await fetch("http://localhost:3000/readers");
        const dados = await resposta.json();
        tableBody.innerHTML = "";

        if (dados.success === false) {
            tableBody.innerHTML = `
            <tr>
                <td colspan="5">Erro ao buscar leitores</td>
            </tr>
            `;
        } else if (dados.length === 0) {
            tableBody.innerHTML = `
            <tr>
                <td colspan='6'>Nenhum leitor cadastrado</td>
            </tr>`;
        } else {
            criarDado(dados);
        }
    } catch (error) {
        tableBody.innerHTML = "<td colspan='6'>Erro ao buscar leitores</td>"
    } finally {
        carregamento.style.display = "none";
    }
}

function criarDado(dados) {
    dados.forEach(user => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nome}</td>
        <td>${formatarTelefone(user.telefone)}</td>
        <td>${user.email}</td>
        <td>${formatarCpf(user.cpf)}</td>
        <td>
            <button id='btn-edit'><i class='bi bi-pen'></i> Editar</button>
            <button id='btn-trash'><i class='bi bi-trash'"></i> Apagar</button>
        </td>
        `;
        tableBody.appendChild(tableRow);
        const btnTrash = document.querySelector("#btn-trash");
        btnTrash.addEventListener("click", () => {
            apagarUser(user.id)
        });
    });
}

buscarLeitores();

async function editarUser(id) {
    const response = await fetch(`http://localhost:3000/books/${id}`);
    const dados = await response.json();

    idEditando = dados.id;

    const inputNome = document.getElementById("nome");
    const inputTelefone = document.getElementById("telefone");
    const inputEmail = document.getElementById("email");
    const inputCpf = document.getElementById("cpf");

    inputNome.value = dados.nome;
    inputTelefone.value = dados.telefone;
    inputEmail.value = dados.email;
    inputCpf.value = dados.cpf;
    
    await fetch(`http://localhost:3000/readersEdit/${idEditando}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })

}