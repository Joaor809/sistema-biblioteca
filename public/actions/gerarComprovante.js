import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { fileURLToPath } from "url";
import formatarData from "./formatarData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function gerarComprovante(emprestimo) {

    const caminhoTemplate = path.join(__dirname, "..", "..", "templates", "comprovante.docx");
    const arquivo = fs.readFileSync(caminhoTemplate);
    const zip = new PizZip(arquivo);

    const documento = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    });
    documento.render({
        titulo: emprestimo.titulo,
        nome: emprestimo.nome,
        data_emprestimo: formatarData(emprestimo.data_emprestimo),
        data_devolucao: formatarData(emprestimo.data_devolucao)
    });
    return documento.getZip().generate({
        type: "nodebuffer"
    });
}
