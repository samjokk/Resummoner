'use strict';

const { createModel, createSchema, dbDisconnect, dbConnect } = require('./dbActions');
const { connection } = require('mongoose');

async function createCollection(name, obj) {
    const schema = createSchema(obj);
    const model = createModel(name, schema);

    await model.createCollection();

    return model;
}

function dropCollection(name) {
    connection.db.dropCollection(name, (err) => {
        if (err)
            console.error(err);
    });
}

module.exports = { createCollection, dropCollection };