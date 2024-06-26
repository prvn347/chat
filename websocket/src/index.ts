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

wss.on(
  "connection",
  function connection(ws: import("ws"), request: any, client: any) {
    ws.on("error", console.error);

    ws.on("message", function message(data, isbinery) {
      console.log(`Received message ${data} from user ${client}`);
      ///here you will write you logic for application it could be sending to server sendin data form server and room server etc.
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isbinery });
        }
      });
    });
    ws.send("Hello! Message From Server!!");
  }
);
