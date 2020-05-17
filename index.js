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

const showTime = (posttime) => {
    return (posttime = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        // the following makes no sense, but it is what it is
        // took quite some rounds of testing
        timeZone: "Etc/GMT-2",
    }).format(posttime));
};

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
    let finalJson = [];

    console.log("The req.body: ", req.body.id);
    var id = req.body.id;
    db.getselctedimageinfos(id)
        .then((result) => {
            return result;
        })
        .then((results) => {
            console.log("image info for selected image", results);

            finalJson.push(results);
        })
        .then(() => {
            db.getcomments(id)
                .then((results) => {
                    console.log("results", results);
                    return results.rows;
                })
                .then((result) => {
                    finalJson.push(result);
                })

                .then(() => {
                    db.getPreAndNext(id)
                        .then((resultPN) => {
                            console.log(
                                "next and previous info",
                                resultPN.rows
                            );
                            return resultPN;
                        })
                        .then((resultPN) => {
                            finalJson.push(resultPN);
                            res.json(finalJson);
                        });
                });
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

        db.addImage(url, username, title, description).then((result) => {
            console.log("newly added img", result.rows[0]);

            res.json(result.rows[0]);
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.post("/upload-comment", (req, res) => {
    console.log("comment info", req.body);
    var img_id = req.body.id;
    var username = req.body.username;
    var comment = req.body.comment;

    db.addComments(username, comment, img_id).then((result) => {
        console.log("Commnet inserted ", result.rows[0]);
        res.json(result.rows[0]);
    });
});

app.post("/reply", (req, res) => {
    console.log("reply info", req.body);
    var comm_id = req.body.id;
    var username = req.body.username;
    var comment = req.body.comment;
    db.addReply(username, comment, comm_id).then((result) => {
        console.log("reply inserted", result.rows[0]);
        res.json(result.rows[0]);
    });
});

app.post("/delete", (req, res) => {
    console.log("requested id", req.body);
    let id = req.body.id;
    db.deleteImgWithComment(id)
        .then((res) => {
            db.deleteImg(id).then((result) => {
                console.log("delete result", result);
            });
        })
        .then((result) => {
            res.json(id);
        });
});

app.post("/moreImages", (req, res) => {
    var id = req.body.id;
    return db
        .getMoreImages(id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("There is an error in More images ", err);
        });
});

app.listen(process.env.PORT || 8084, () => console.log("Server is running"));
