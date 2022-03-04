const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/images"
);

module.exports.getAllData = function () {
    return db.query(
        `SELECT *, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
    )   AS "lowestId"  
        FROM images
        ORDER by created_at DESC
        LIMIT 3`
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

module.exports.getImageById = function (id) {
    return db.query(
        `
        
        SELECT * FROM images WHERE id = $1
        
        `,
        [id]
    );
};

module.exports.getThreeMoreImages = function (lowest) {
    return db.query(
        `
        SELECT *, (
    SELECT id FROM images
    ORDER BY id ASC
    LIMIT 1
) AS "lowestId" FROM images
WHERE id < $1
ORDER BY id DESC
LIMIT 3;
        `,
        [lowest]
    );
};

module.exports.addComment = function (comment, username, image_id) {
    return db.query(
        `

        INSERT INTO comments (comment, username, image_id) VALUES($1, $2, $3)
        RETURNING *

        `,
        [comment, username, image_id]
    );
};

module.exports.getCommentsByImageID = function (image_id) {
    return db.query(
        `
    
    SELECT * FROM comments WHERE image_id = $1
    
    `,
        [image_id]
    );
};

module.exports.deletePicAndComments = function (image_id) {
    return db
        .query(
            `
    
        DELETE FROM comments WHERE image_id = $1

    `,
            [image_id]
        )
        .then(() => {
            console.log("deleted image");
            db.query(
                `
        
            DELETE FROM images WHERE id = $1
        
        `,
                [image_id]
            );
        })
        .catch((e) => {
            console.log("Error deleting from DB:  ", e);
        });
};
