const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("./public"));

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const config = require("./config.json");

const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
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

app.get("/images", (req, res) => {
    db.getimageinfos()
        .then((results) => {
            console.log("results", results.rows);
            return results.rows;
        })
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log("error in /images", err);
        });
});
app.use(express.json());
app.post("/info", (req, res) => {
    console.log("The req.body: ", req.body.id);
    var id = req.body.id;
    db.getselctedimageinfos(id)
        .then((result) => {
            return result;
        })
        .then((results) => {
            console.log("image info for selected image", results);
            res.json(results);
        })
        .catch((err) => {
            console.log("error in getting info for selected img", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("file", req.file.filename);
    console.log("input", req.body.title);

    if (req.file) {
        // you'll eventually want to make a db insert here for all the info!
        let title = req.body.title;
        let description = req.body.description;
        let username = req.body.username;
        let filename = req.file.filename;
        let url = config.s3Url + filename;
        console.log("json", config.s3Url + filename);

        var data = {
            url: url,
            title: title,
            username: username,
            description: description,
        };
        db.addImage(url, username, title, description);
        console.log("data", data);

        res.json(data);
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log("Server is running"));
