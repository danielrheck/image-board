const express = require("express");
const app = express();
const { getAllData, addImage } = require("./sql/db");
// require those to process file data server side
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

let secrets;

if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    addImage(
        `https://${secrets.AWS_BUCKET_NAME}.s3.amazonaws.com/${req.file.filename}`,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
});

// this route should come below any route the server has to serve data to the client side
app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
