const mongodb = require('mongodb');

class Mongo {
    constructor(dbName, collectionName) {
        this._dbName = dbName;
        this._collectionName = collectionName;
    }

    async connect() {
        try {
            const MongoClient = mongodb.MongoClient;
            this._mongoClient = new MongoClient("mongodb://78.140.243.77:27017", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            this.client = await this._mongoClient.connect();
            this.collection = this.client.db(this._dbName).collection(this._collectionName);
        }
        catch (e) {
            this.isConnected = false;
            throw e;
        }

        this.isConnected = true;
    }

    async getRecords(limit, skip) {
        if (typeof (limit) === 'undefined' || typeof (skip) === 'undefined') return null;
        const records = await this.collection.find().limit(parseInt(limit, 10)).skip(parseInt(skip, 10)).toArray();
        return records;
    }

    async getPosts(theme, to, from, sources, limit, skip) {
        const records = await this.collection.find({
            $and: [
                {
                    $where: `function() {
                        return this.themes.includes(${theme});
                    }`
                },
                {
                    "owner_id": {
                        $in: sources
                    }
                },
                {
                    "date": {
                        $gte: from, $lte: to
                    }
                }
            ]
        }).limit(limit).skip(skip).toArray();
        return records;
    }

    async addRecord(record) {
        await this.collection.insertOne(record);
    }

    async getDataForLineChart(indexTheme) {
        const objectCollection = await this.collection.find().toArray();
        return objectCollection[0].analysis[indexTheme];
    }
}

module.exports = { Mongo };