create database biblioteca;
use biblioteca;
create table livros(
    id int auto_increment primary key,
    titulo varchar(150) not null,
    autor varchar(100) not null,
    ano int not null,
    editora varchar(100) not null
);
create table leitores(
    id int auto_increment primary key,
    nome varchar(100) not null,
    telefone varchar(20),
    email varchar(150),
    cpf char(11)
);
create table emprestimos(
    id int auto_increment primary key,
    livro_id int not null,
    leitor_id int not null,
    data_emprestimo date not null,
    data_devolucao date,
    status enum("emprestado", "devolvido") default "emprestado",
    foreign key (livro_id) references livros(id),
    foreign key (leitor_id) references leitores(id)
);
