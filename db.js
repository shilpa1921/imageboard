const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getimageinfos = () => {
    return db
        .query(`SELECT * FROM images order by created_at DESC LIMIT 9`)
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

module.exports.addReply = (username, comment, comm_id) => {
    return db.query(
        `INSERT INTO replys (username, comment, comm_id) VALUES ($1, $2, $3) RETURNING *`,
        [username, comment, comm_id]
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

module.exports.getPreAndNext = (id) => {
    return db
        .query(
            ` SELECT * from images WHERE (id = (SELECT min(id) from images WHERE id > $1) or  id = (SELECT max(id) from images WHERE id < $1) );`,
            [id]
        )
        .then((result) => {
            return result;
            console.log("delete image");
        })
        .catch((err) => {
            console.log("err111", err);
        });
};

module.exports.getMoreImages = (id) => {
    return db.query(
        `SELECT *, (
            SELECT id FROM images ORDER BY id ASC LIMIT 1
        ) AS lowest_id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 9;`,
        [id]
    );
};

module.exports.getreplyWithid = (id) => {
    return db.query(
        `SELECT replys.id,  replys.username, replys.comment FROM replys JOIN comments ON replys.comm_id = comments.id JOIN images ON comments.img_id = images.id WHERE comments
.img_id = $1;`,
        [id]
    );
};
