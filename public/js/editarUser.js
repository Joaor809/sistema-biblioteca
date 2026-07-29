export default async function editarUser(id) {
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