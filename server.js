const express = require("express");
const app = express();
const port = 3000;

const controller = require("./lib/controller.js");

app.use(express.urlencoded({
    extended: false
}));

app.get("/", (req, res) => {});

app.get("/movie/:id", (req, res) => {});

app.post("/movies", (req, res) => {});

app.delete("/movies", (req, res) => {});

app.put("/movies", (req, res) => {});

app.listen(port, () => console.log("Listening on port " + port));
