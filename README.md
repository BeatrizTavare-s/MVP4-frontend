
# 🌐 Frontend - Study Content

Este é o **Frontend** do projeto [Study Content](https://github.com/BeatrizTavare-s/MVP4-backend), desenvolvido com **HTML, CSS e JavaScript**. Ele oferece uma interface intuitiva para que o usuário possa:

- Visualizar e interagir com os **cards de estudo**
- Adicionar **sessões de estudo**
- Gerar e visualizar **cronogramas com IA (OpenAI)**
- Buscar e gerar PDFs com **sugestões de livros via Google Books**

---

## 🔗 APIs Utilizadas

- **Study API (Python):** `/study`, `/category`, `/completed`, `/schedule`
- **Sessions API (Node):** `/sessions`
- **OpenAI API (via proxy Node.js):** `/chat?prompt=...`
- **Google Books API:** [`https://www.googleapis.com/books/v1/volumes?q=<titulo>`](https://developers.google.com/books/docs/overview?hl=pt-br)

---

## 📦 Como rodar o frontend localmente

1. Clone este repositório
2. Navegue até o diretório onde está o `index.html`
3. Abra o arquivo.

---

## 🐳 Como rodar com Docker

1. Acesse a pasta com backend principal:
[Study Content](https://github.com/BeatrizTavare-s/MVP4-backend)

2. Execute o comando para build:
```bash
docker compose up --build
```

---

## 🧭 Arquitetura do Projeto

O frontend é o ponto central de interação do usuário e consome múltiplas APIs do projeto:

![Fluxograma da Arquitetura](https://github.com/BeatrizTavare-s/MVP4-backend/blob/main/img-readme/Fluxograma-explicado.PNG)

---

## 🎥 Demonstração do Projeto

Assista ao vídeo demonstrativo completo no YouTube:  
🔗 [https://www.youtube.com/watch?v=ZLq17Gpz654&ab_channel=BeatrizTavares](https://www.youtube.com/watch?v=ZLq17Gpz654&ab_channel=BeatrizTavares)

---

## 📌 Projeto completo

✅ Comunicação com múltiplas APIs:
- 📘 **API Principal (Python)**: gerencia cards de estudo, categorias e cronogramas
🔗 [Ver repositório](https://github.com/BeatrizTavare-s/MVP4-backend)
- 🌐 **Frontend (HTML/CSS/JS)**: interface web para interação com estudos, sessões e geração de PDFs  
  🔗 [Ver repositório](https://github.com/BeatrizTavare-s/MVP4-frontend)
- 🧩 **API de Sessões (NodeJS)**: adiciona e lista sessões de estudo por assunto
🔗 [Ver repositório](https://github.com/BeatrizTavare-s/MVP4-API-SESSIONS)
- 🤖 **API OpenAI (NodeJS)**: gera cronogramas semanais com ajuda da IA
🔗 [Ver repositório](https://github.com/BeatrizTavare-s/MVP4-API-CHAT)

📄 Geração de PDFs:
- PDF com **cronograma de estudo** retornado pela OpenAI
- PDF com **lista de livros sugeridos** retornados pela Google Books API

🎨 Interface amigável:
- Cards coloridos por categoria
- Botões para ações: concluir, excluir, gerar cronograma e buscar livros
- Tabela de sessões de estudo por duração