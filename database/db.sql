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
    telefone varchar(20) not null,
    email varchar(150) not null,
    cpf char(11) not null
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
use biblioteca;
select * from livros;
INSERT INTO livros (titulo, autor, ano, editora) VALUES
('Bom Crioulo', 'Adolfo Caminha', 2019, 'Todavia'),
('A Normalista', 'Adolfo Caminha', 2007, 'Martin Claret'),
('Casa de Pensão', 'Aluísio Azevedo', 2013, 'Martin Claret'),
('Ponto de Fuga', 'Ana Maria Machado', 2015, 'Companhia das Letras'),
('A Última Quimera', 'Ana Miranda', 2013, 'Companhia das Letras'),
('Dom Casmurro', 'Machado de Assis', 2019, 'Companhia das Letras'),
('O Cortiço', 'Aluísio Azevedo', 2018, 'Penguin-Companhia'),
('Grande Sertão: Veredas', 'João Guimarães Rosa', 2019, 'Companhia das Letras'),
('Capitães da Areia', 'Jorge Amado', 2009, 'Companhia das Letras'),
('A Hora da Estrela', 'Clarice Lispector', 2020, 'Rocco');