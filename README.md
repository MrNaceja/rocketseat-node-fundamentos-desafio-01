
# 🚀 Desafio Node.js - Fundamentos com CRUD de Tasks

Este projeto é uma API desenvolvida como parte do [desafio](https://efficient-sloth-d85.notion.site/Desafio-01-2d48608f47644519a408b438b52d913f) de fundamentos do Node.js da [Rocketseat](https://www.rocketseat.com.br/).  
A aplicação realiza o gerenciamento de tarefas (tasks), com funcionalidades de **CRUD completo**, além de **importação e exportação de dados via CSV** como funcionalidades extras.

---

## 📋 Funcionalidades

A API permite:

- ✅ Criar uma nova task
- 📄 Listar todas as tasks com filtros por título e descrição
- ✏️ Atualizar uma task específica pelo ID
- ❌ Remover uma task pelo ID
- ☑️ Marcar uma task como completa ou reverter para incompleta
- 📥 Importar tasks em massa via arquivo CSV
- 📤 Exportar tasks filtradas em formato CSV

---

## 📌 Estrutura da Task

Cada task possui a seguinte estrutura:

```json
{
  "id": "uuid",
  "title": "Título da tarefa",
  "description": "Descrição detalhada",
  "completed_at": null,
  "created_at": "data de criação",
  "updated_at": "data da última atualização"
}
```

---

## 🔗 Rotas da API

### 📌 `POST /tasks`
Cria uma nova task.

#### Requisição:
```json
{
  "title": "Estudar Node.js",
  "description": "Estudar os fundamentos da plataforma Node.js"
}
```

#### Regras:
- Os campos `title` e `description` são obrigatórios.
- Os campos `id`, `created_at`, `updated_at` e `completed_at` são definidos automaticamente.

---

### 📌 `GET /tasks`
Lista todas as tasks.

#### Filtros disponíveis via query string:
- `title`
- `description`

#### Exemplo:
```
GET /tasks?title=node&description=fundamentos
```

---

### 📌 `PUT /tasks/:id`
Atualiza o `title` e/ou `description` de uma task existente.

#### Requisição:
```json
{
  "title": "Novo título",
  "description": "Nova descrição"
}
```

#### Regras:
- Pelo menos um dos campos (`title` ou `description`) deve estar presente.
- Valida se o `id` existe antes de atualizar.

---

### 📌 `DELETE /tasks/:id`
Remove uma task existente.

#### Regras:
- Valida se o `id` existe antes de remover.

---

### 📌 `PATCH /tasks/:id/complete`
Alterna o estado de conclusão da task.

#### Regras:
- Marca a task como **concluída** ou **não concluída**.
- Valida se o `id` existe antes de atualizar.

---

## 📥 Importação de Tasks via CSV

### 📌 `POST /tasks/import`

Importa tasks a partir de um arquivo CSV.  
O caminho do arquivo está configurado internamente no projeto para `src/uploads/tasks.csv`.

#### Regras:
- Utiliza **Streams** para processar grandes volumes de dados sem travar a aplicação.
- As tasks importadas devem conter ao menos os campos `title` e `description`.

#### Exemplo de conteúdo do CSV:

```csv
title,description
"Aprender Node.js","Focar nos fundamentos e boas práticas"
"Praticar desafios","Resolver problemas de lógica com JavaScript"
```

---

## 📤 Exportação de Tasks para CSV

### 📌 `GET /tasks/export`

Exporta tasks do banco de dados em formato `.csv`.

#### Filtros disponíveis via query string:
- `title`
- `description`

#### Exemplo:
```
GET /tasks/export?title=node
```

O retorno é um arquivo CSV com os dados das tasks filtradas.

---

## ▶️ Executando o projeto

```bash
# Instale as dependências
npm install

# Inicie o servidor
npm run dev
```

A API estará disponível em:  
[http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tecnologias utilizadas

- Node.js
- JavaScript (ESM)
- HTTP nativo (`node:http`)
- Streams
- CSV
- UUID

---

Desenvolvido com 💜 para o desafio da [Rocketseat](https://www.rocketseat.com.br/)
