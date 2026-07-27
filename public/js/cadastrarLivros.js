const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("nome").value;
    const author = document.getElementById("autor").value;
    const year = Number(document.getElementById("ano").value);
    const publisher = document.getElementById("editora").value;

    const response = await fetch("http://localhost:3000/registerBook", {
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
});