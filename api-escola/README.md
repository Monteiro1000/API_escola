# API Escola

## Objetivo do projeto
Ajudar no aprendizado de construção de uma API REST para gestão escolar, aplicando boas práticas de organização, modelagem de dados e definição de endpoints.

## Endpoints previstos
### Alunos
- `GET /alunos` → listar alunos
- `GET /alunos/{id}` → buscar aluno por ID
- `POST /alunos` → criar aluno
- `PUT /alunos/{id}` → atualizar aluno
- `DELETE /alunos/{id}` → remover aluno

### Cursos
- `GET /cursos` → listar cursos
- `GET /cursos/{id}` → buscar curso por ID
- `POST /cursos` → criar curso
- `PUT /cursos/{id}` → atualizar curso
- `DELETE /cursos/{id}` → remover curso

## Entidades do banco
### Curso
- `id` (PK)
- `nome`

### Aluno
- `id` (PK)
- `nome`
- `email`
- `curso_id` (FK → Curso.id)

## Layout inicial (modelo relacional)
```text
Curso
 ├─ id (PK)
 └─ nome

Aluno
 ├─ id (PK)
 ├─ nome
 ├─ email
 └─ curso_id (FK -> Curso.id)
```

## Fluxo cliente → API
```text
Cliente -> API -> Banco -> API -> Cliente
```

### Explicação do fluxo
1. O cliente (web/mobile) envia uma requisição HTTP para a API.
2. A API valida os dados e aplica as regras de negócio.
3. A API consulta ou persiste dados no banco.
4. O banco retorna o resultado para a API.
5. A API formata a resposta e devolve ao cliente.

## Como executar o projeto
### Pré-requisitos
- Node.js 18+

### Passos
1. Instale as dependências:
	- `npm install`
2. Inicie em modo desenvolvimento:
	- `npm run dev`
3. A API ficará disponível em:
	- `http://localhost:3000`

## Rotas iniciais implementadas
- `GET /health`

### Cursos
- `GET /api/cursos`
- `GET /api/cursos/{id}`
- `POST /api/cursos`
- `PUT /api/cursos/{id}`
- `DELETE /api/cursos/{id}`

### Alunos
- `GET /api/alunos`
- `GET /api/alunos/{id}`
- `POST /api/alunos`
- `PUT /api/alunos/{id}`
- `DELETE /api/alunos/{id}`
