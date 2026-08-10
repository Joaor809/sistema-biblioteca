const form = document.querySelector("form");

const cpf = document.getElementById("cpf");
let cpfNumeros = "";
cpf.addEventListener("input", (event) => {
    cpfNumeros = event.target.value.replace(/\D/g, "");

    let valor = cpfNumeros;

    valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(
        /^(\d{3})\.(\d{3})\.(\d{3})(\d)/,
        "$1.$2.$3-$4"
    );

    event.target.value = valor;
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const senha = document.getElementById("senha").value;
    if (cpfNumeros === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }
    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cpfNumeros,
                senha
            })
        });

        const dados = await response.json();

        if (!response.ok) {
            alert(dados.message || "Não foi possível entrar.");
            return;
        }

        window.location.href = dados.redirect || "/";
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao conectar com o servidor.");
    }
});
