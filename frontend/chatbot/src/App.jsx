import { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [started, setStarted] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMsg = message;

    setStarted(true);
    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setMessage("");

    const response = await fetch("https://chatbot-7z4f.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    });

    const data = await response.json();

    setChat((prev) => [...prev, { role: "bot", text: data.reply }]);
  }

  return (
    <div className={started ? "page started" : "page"}>

      {!started && (
        <div className="center-box">
          <h1>Ask anything</h1>

          <div className="center-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button onClick={sendMessage}>
              <FiSend />
            </button>
          </div>
        </div>
      )}

      {started && (
        <>
          <div className="chat-box" ref={chatRef}>
            {chat.map((c, i) => (
              <div
                key={i}
                className={c.role === "user" ? "user-msg" : "bot-msg"}
              >
                {c.text}
              </div>
            ))}
          </div>

          <div className="bottom-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button onClick={sendMessage}>
              <FiSend />
            </button>
          </div>
        </>
      )}

    </div>
  );
}

export default App;