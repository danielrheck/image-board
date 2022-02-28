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
