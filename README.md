

````markdown
# TranscriptQnA – AI Transcript Chat Assistant  

An **AI-powered transcript assistant** built with **Node.js** and **Grok AI**.  
It reads transcripts, answers user questions, and streams responses in real-time for a smooth chat experience.  
Includes **Swagger UI** for API documentation and testing.  

---

## ✨ Features  
- ⚡ **Grok AI Integration** – Understands and processes transcripts intelligently  
- 💬 **Streaming Chat** – Real-time responses for natural conversation flow  
- 📑 **Swagger UI** – Interactive API documentation  
- 📝 **Transcript QnA** – Upload transcripts and ask questions directly  
- 🎯 Useful for meetings, lectures, interviews, and research  

---

## 🚀 Tech Stack  
- **Backend:** Node.js + Express  
- **AI:** Grok AI  
- **API Docs:** Swagger UI  
- **Streaming:** Server-Sent Events (SSE) / WebSocket (depending on your implementation)  

---

## 📦 Installation  

```bash
# Clone the repository
git clone https://github.com/your-username/transcriptqna.git

# Navigate into the project folder
cd transcriptqna

# Install dependencies
npm install
````

---

## ⚡ Running the Server

```bash
# Start the development server
npm run dev

# Or start normally
npm start
```

Server will run at:
👉 `http://localhost:3000`

Swagger UI available at:
👉 `http://localhost:3000/api-docs`

---

## 📑 API Endpoints

| Method | Endpoint              | Description                         |
| ------ | --------------------- | ----------------------------------- |
| POST   | `/transcripts/upload` | Upload a transcript                 |
| POST   | `/summaries/generate` | Generate AI summary from transcript |
| POST   | `/chat/stream`        | Start a streaming chat session      |
| GET    | `/api-docs`           | Swagger API documentation           |

---

## 🎮 Usage

1. Upload a transcript via API or Swagger UI.
2. Ask questions about the transcript using the chat endpoint.
3. Enjoy **streaming AI answers** powered by Grok AI.

---

## 🛠 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
GROK_API_KEY=your_grok_api_key_here
```

---

## 📜 Example: Streaming Chat with Fetch

Here’s how you can connect to the streaming chat endpoint from a frontend:

```javascript
const eventSource = new EventSource("http://localhost:3000/chat/stream");

eventSource.onmessage = (event) => {
  console.log("AI Response:", event.data);
};

eventSource.onerror = () => {
  console.error("Connection lost");
  eventSource.close();
};
```

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests.

---



