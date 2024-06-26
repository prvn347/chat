import { useEffect, useRef, useState } from "react";
import "./App.css";
import YouTube, { YouTubeProps } from "react-youtube";

interface chat {
  msg: string;
}

function App() {
  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  const [socket, newSocket] = useState<null | WebSocket>(null);
  const [chat, setChat] = useState("");
  const [chatHistory, setHistory] = useState<chat[]>([]);
  const [play, setPlay] = useState(false);
  const playerRef = useRef<any>(null);
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
  };

  const onPlayerPlay: YouTubeProps["onPlay"] = (event) => {
    console.log("play");

    socket?.send("play");
  };

  const onPlayerPause: YouTubeProps["onPause"] = (event) => {
    console.log("pause");
    socket?.send("pause");
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("connection established");
    };
    ws.onmessage = (message) => {
      console.log("Message received:", message.data);
      if (message.data === "play") {
        setPlay(true);
      } else if (message.data === "pause") {
        setPlay(false);
      }
      setHistory((prevHistory) => [...prevHistory, { msg: message.data }]);
    };
    newSocket(ws);
    return () => ws.close();
  }, [play]);
  useEffect(() => {
    if (play) {
      console.log("played bro");
      playerRef.current?.playVideo();
    } else {
      playerRef.current?.pauseVideo();
    }
  }, [play]);

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
            <span
              key={index}
              style={{
                margin: "13",
                padding: "2px",
              }}
            >
              {msg.msg}
              <br />
            </span>
          ))}
        </div>
        <input type="text" onChange={(e) => setChat(e.target.value)} />
        <button onClick={() => socket?.send(chat)}>Send</button>
      </div>
      <audio controls>
        <source src="./song.ogg" type="audio/ogg" />
      </audio>
      <div>
        <YouTube
          videoId="2g811Eo7K8U"
          opts={opts}
          onReady={onPlayerReady}
          onPlay={onPlayerPlay}
          onPause={onPlayerPause}
        />
      </div>
    </>
  );
}

export default App;
