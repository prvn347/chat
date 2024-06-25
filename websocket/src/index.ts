import { Request, Response } from "express";
import { WebSocketServer, WebSocket, Server } from "ws";
import express from "express";
const app = express();
app.get("/", (req: Request, res: Response) => {
  res.send("heelo");
});
const httpserver = app.listen(8080, () => {
  console.log("server is running on 8080");
});

const wss = new WebSocketServer({ server: httpserver });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data, isbinery) {
    ws.getMaxListeners()
    ///here you will write you logic for application it could be sending to server sendin data form server and room server etc.
    wss.clients.forEach(function each(clients) {
      if (clients.readyState == WebSocket.OPEN) {
        clients.send(data, { binary: isbinery });
        console.log("someone has sent " + data);
      }
    });
  });
  ws.send("Hello! Message From Server!!");
});
