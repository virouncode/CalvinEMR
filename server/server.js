//Imports
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const path = require("path");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const extractTextFromDoc = require("./extractTextFromDoc");
const bodyParser = require("body-parser");
const { log } = require("console");
const cors = require("cors"); // Import the cors middleware

const PORT = process.env.PORT || 4000;

//****************** APP ***************************//
const app = express();
const httpServer = http.createServer(app);
const io = new socketIo.Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? "*" : ["http://localhost:3000"],
  },
});
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//***************** Endpoint TWILIO ******************//
app.post("/api/twilio/messages", async (req, res) => {
  try {
    res.header("Content-Type", "application/json");
    await twilio.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body,
    });
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
});
//****************************************************//

//**************** Endpoint DOCUMENT AI **************//
app.post("/api/extractToText", async (req, res) => {
  try {
    const { docUrl, mime } = req.body;
    const result = await extractTextFromDoc(docUrl, mime);
    res.send(result);
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
    res.send(JSON.stringify({ success: false }));
  }
});

//****************************************************//

//*************** Endpoint to connect to Xano **********//
// Create a custom API endpoint to receive data
app.post("/xano-message", (req, res) => {
  // Extract the message from the request body
  const allergy = req.body.allergy;
  console.log(allergy);
  // Broadcast the message to all connected clients
  io.emit("xano message", message);
  // Respond to the HTTP request
  res.status(200).send("Message sent successfully");
});

//******************************************************/

//Dans les autres cas on renvoie la single page app
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

//****************** SOCKET **************************//
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Handle incoming WebSocket messages
  socket.on("xano message", (message) => {
    io.emit("xano message", message); // Broadcast the message to all connected clients
  });
});
//***************************************************/

httpServer.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port ${PORT}`);
});
