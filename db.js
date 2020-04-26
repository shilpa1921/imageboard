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
module.exports.getcomments = (id) => {
    return db
        .query(
            `SELECT * FROM comments WHERE comments.img_id = $1 order by created_at DESC`,
            [id]
        )
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
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
        [url, username, title, description]
    );
};

module.exports.addComments = (username, comment, img_id) => {
    return db.query(
        `INSERT INTO comments (username, comment, img_id) VALUES ($1, $2, $3) RETURNING *`,
        [username, comment, img_id]
    );
};

module.exports.deleteImg = (id) => {
    return db
        .query(`DELETE FROM images WHERE images.id = $1 RETURNING id`, [id])
        .then((result) => {
            return result;
            console.log("delete image");
        })
        .catch((err) => {
            console.log("err111", err);
        });
};
module.exports.deleteImgWithComment = (id) => {
    return db
        .query(`DELETE FROM comments WHERE comments.img_id = $1 RETURNING id`, [
            id,
        ])
        .then((result) => {
            return result;
            console.log("delete image");
        })
        .catch((err) => {
            console.log("err111", err);
        });
};
