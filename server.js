const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static("client/build"));

//API TEST
app.get("/api/viroun", (_, res) => {
  res.send({
    msg: "Hello Viroun",
  });
});
//Autres adresses API ici
//*********************/

//Dans les autres cas on renvoie la single page app
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port ${PORT}`);
});
