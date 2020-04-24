const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getimageinfos = () => {
    return db
        .query(`SELECT * FROM images order by created_at DESC`)
        .then((results) => {
            return results;
        })
        .catch((err) => {
            console.log("err111", err);
        });
};

module.exports.getselctedimageinfos = (id) => {
    return db
        .query(`SELECT * FROM images WHERE images.id = $1 `, [id])
        .then((results) => {
            return results.rows;
        })
        .catch((err) => {
            console.log("error in getting info selected image", err);
        });
};

module.exports.addImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4)`,
        [url, username, title, description]
    );
};
