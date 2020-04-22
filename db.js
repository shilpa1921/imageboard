const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getimageinfos = () => {
    return db
        .query(`SELECT * FROM images`)
        .then((results) => {
            return results;
        })
        .catch((err) => {
            console.log("err111", err);
        });
};
