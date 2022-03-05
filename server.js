const express = require("express");
const app = express();
const {
    getAllData,
    addImage,
    getImageById,
    getCommentsByImageID,
    addComment,
    getThreeMoreImages,
    deletePicAndComments,
} = require("./sql/db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

let secrets;

if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
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

app.get("/getImage", (req, res) => {
    let id = req.query.imageid;
    getImageById(id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((e) => {
            console.log("Error getting data from DB:  ", e);
        });
});

app.get("/more", (req, res) => {
    getThreeMoreImages(req.query.lowestid).then(({ rows }) => {
        res.json(rows);
    });
});

app.delete("/delete", s3.deleteObjFromS3, (req, res) => {
    let image_id = req.query.imageid;
    deletePicAndComments(image_id).then(() => {
        res.sendStatus(200);
    });
});

app.get("/comments", (req, res) => {
    getCommentsByImageID(req.query.imageid)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((e) => {
            console.log("Error getting comments from DB:  ", e);
        });
});

app.post("/comments", (req, res) => {
    addComment(req.body.comment, req.body.username, req.body.id)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((e) => {
            console.log("Error inserting comment in DB:  ", e);
        });
});

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

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`Running on 8080`));
