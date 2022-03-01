const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/images"
);

module.exports.getAllData = function () {
    return db.query(
        `SELECT * FROM images
        ORDER by created_at DESC`
    );
};

module.exports.addImage = function (url, username, title, description) {
    return db.query(
        `
    INSERT INTO images (url, username, title, description) VALUES ($1,$2,$3,$4)
    RETURNING *
    
    `,
        [url, username, title, description]
    );
};
