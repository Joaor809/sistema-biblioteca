async function buscarLivros(){
    try {
        const response = await fetch("http://localhost:3000/books");
        const dados = await response.json()

        const campoQuantidadeLivros = document.querySelector(".card-livros");
        campoQuantidadeLivros.innerHTML += `<p>${dados.length}</p>`
    } catch(error) {
        alert("Erro ao buscar livros");
    }
}
async function buscarLeitores(){
    try {
        const response = await fetch("http://localhost:3000/readers");
        const dados = await response.json()

        const campoQuantidadeLeitores = document.querySelector(".card-leitores");
        campoQuantidadeLeitores.innerHTML += `<p>${dados.length}</p>`
    } catch(error) {
        alert("Erro ao buscar leitores");
    }
}
async function buscarEmprestimos(){
    try {
        const response = await fetch("http://localhost:3000/loan");
        const dados = await response.json()

        const campoQuantidadeEmprestimos = document.querySelector(".card-emprestimos");
        campoQuantidadeEmprestimos.innerHTML += `<p>${dados.length}</p>`
    } catch(error) {
        alert("Erro ao buscar emprestimos");
    }
}
buscarLivros();
buscarLeitores();
buscarEmprestimos();