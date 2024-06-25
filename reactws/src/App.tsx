import { useEffect, useState } from "react";

import "./App.css";

interface chat {
  msg: string;
}
function App() {
  const [socket, newSocket] = useState<null | WebSocket>();

  const [chat, setChat] = useState("");
  const [chatHistory, setHistory] = useState<chat[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("connection established");
      // ws.send("heelo server");
    };
    ws.onmessage = (message) => {
      console.log("Message received:", message.data);
      setHistory((prevHistory) => [...prevHistory, { msg: message.data }]);
    };
    newSocket(ws);
    return () => ws.close();
  }, []);

  if (!socket) {
    return <div>connecting to server....</div>;
  }

  return (
    <>
      <div>
        <div
          className="chat"
          style={{
            background: "purple",
          }}
        >
          {chatHistory.map((msg, index) => (
            <>
              <span
                style={{
                  margin: "13",
                  padding: "2px",
                }}
                key={index}
              >
                {msg.msg}
              </span>
              <br />
            </>
          ))}
        </div>
        <input
          type="text"
          onChange={(e) => {
            setChat(e.target.value);
          }}
        />

        <button
          onClick={() => {
            socket?.send(chat);
          }}
        >
          Send
        </button>
      </div>
    </>
  );
}

export default App;
