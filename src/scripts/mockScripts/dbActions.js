const mongoose = require('mongoose');
const config = require('config');
const { MongoClient, Db } = require('mongodb');

let client;

async function dbConnect() {
    try {
        console.log(config.get('mongoUri'));
        client = new MongoClient(await config.get('mongoUri'));
        await client.connect();
        const db = client.db('myFirstDatabase');
        console.log(db);
        return db;
    } 
    catch (e) {
        console.error('MongoDB connect error');
    }
}

async function addOne(collectionName, obj) {
    try {
        await db.collection(collectionName).insertOne(obj);
    }
    catch (e) {
        console.error('MongoError:\n', e);
    }
}

async function addMany(collectionName, objectsArray) {
    try {
        await db.collection(collectionName).insertMany(objectsArray);
    }
    catch(e) {
        console.error('MongoError:\n', e);
    }
}

module.exports = { dbConnect, addOne };
