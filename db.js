import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const conn = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    // PORT é a porta do servidor Express. A porta do MySQL deve ser separada
    // para que a aplicação não tente se conectar ao próprio servidor HTTP.
    port: Number(process.env.DB_PORT || 3306),
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default conn;
