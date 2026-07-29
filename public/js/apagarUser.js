export default async function apagarUser(id) {
    const response = await fetch(`http://localhost:3000/readers/${id}`, {
        method: "DELETE"
    });

    const dados = await response.json();
    if (dados.success) {
        alert(dados.message);
        buscarLeitores();
    } else {
        alert(dados.message);
    }
}