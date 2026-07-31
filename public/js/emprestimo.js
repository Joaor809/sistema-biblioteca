const form = document.querySelector("form");

async function buscarLivros(){
    const response = await fetch("http://localhost:3000/books");
    const dados = await response.json();
    const selectLivro = document.querySelector("#livros");

    dados.forEach(dado => {
        const option = document.createElement("option");
        option.value = dado.id;
        option.textContent = dado.titulo;
        selectLivro.appendChild(option);
    });
}
async function buscarLeitores(){
    const response = await fetch("http://localhost:3000/readers");
    const dados = await response.json();
    const selectLivro = document.querySelector("#leitores");

    dados.forEach(dado => {
        const option = document.createElement("option");
        option.value = dado.id;
        option.textContent = dado.nome;
        selectLivro.appendChild(option);
    });
}
buscarLeitores();
buscarLivros();