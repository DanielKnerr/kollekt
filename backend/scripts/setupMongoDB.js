const { Config } = require("../config");

const MongoClient = require("mongodb").MongoClient;

function promiseCreateCollection(db, name) {
    return new Promise((resolve, reject) => {
        db.createCollection(name, (err, res) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

MongoClient.connect(Config.mongoURL, async (err, db) => {
    if (err) throw err;

    let databaseObject = db.db(Config.mongoDatabaseName);

    await promiseCreateCollection(databaseObject, "users");
    await promiseCreateCollection(databaseObject, "notes");

    db.close();
});