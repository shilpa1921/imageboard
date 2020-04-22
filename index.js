const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("./public"));

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

app.listen(8080, () => console.log("Server is running"));
