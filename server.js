const express = require("express");
const app = express();
const { getAllData } = require("./sql/db");

app.get("/allImages", (req, res) => {
    getAllData()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((e) => {
            console.log("Error getting images from DB:  ", e);
            res.status(404);
            res.send();
        });
});

app.use(express.static("./public"));

app.use(express.json());

// this route should come below any route the server has to serve data to the client side
app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
