const form = document.querySelector("form");

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

const telefone = document.getElementById("telefone");
let telefoneNumeros = "";
telefone.addEventListener("input", (event) => {
    telefoneNumeros = event.target.value.replace(/\D/g, "");

    let valor = telefoneNumeros;

    valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

    event.target.value = valor;
})

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;


    if (name === "" || email === "" || senha === "" || telefoneNumeros === "" || cpfNumeros === ""){
        alert("Preencha todos os campos!");
    } else{
        const response = await fetch("/librarian", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                name,
                email,
                senha,
                cpfNumeros,
                telefoneNumeros
            })
        });
        const dados = await response.json();
    }
    form.reset();
})