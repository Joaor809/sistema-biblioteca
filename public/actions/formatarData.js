export default function formatarData(data) {
    const novaData = new Date(data);

    const dia = String(novaData.getDate()).padStart(2, "0");
    const mes = String(novaData.getMonth() + 1).padStart(2, "0");
    const ano = novaData.getFullYear();

    return `${dia}/${mes}/${ano}`;
}