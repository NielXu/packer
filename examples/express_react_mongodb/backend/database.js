const MongoClient = require('mongodb').MongoClient;

const host = "localhost"
const port = 27017
const dbName = "webapp"
const url = `mongodb://${host}:${port}`;

// Connection testing
async function test() {
    let conn = await MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
    await conn.db(dbName).admin().listDatabases();
    conn.close();
}

module.exports = {
    test: test
}
