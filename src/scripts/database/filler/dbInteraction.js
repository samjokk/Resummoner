const config = require('config');
const idsCommunity = config.get('idsCommunity');
const { Mongo } = require('../mongo');

class Database {
    _dbName = config.get('databaseName');
    _collectionName = config.get('collectionName');
    _mongo;

    async dbConnect() {
        this._mongo = new Mongo(this._dbName, this._collectionName);
        await this._mongo.connect();
    }

    async fullDatabaseFillingForYear(themes) {
        const startDate = config.get('startDateYear');
        const { Content } = require('./content.js');
        let countPosts = new Array();
        for (const idCommunity in idsCommunity) {
            let countOffset = 0;
            const content = new Content();
            console.log("БЕРЁМ ДАННЫЕ ИЗ ИСТОЧНИКА: " + idCommunity);
            let countPostsFromOneSource = 0; //Для отчётности
            let dateIsOk = true;
            while (dateIsOk) {
                let objectsToDatabase = new Array();
                objectsToDatabase = await content.fullDataCollectionFrom100Posts(idsCommunity[idCommunity], countOffset, themes);
                if (objectsToDatabase.length != 0) {
                    await this.addMany(objectsToDatabase);
                    console.log('В базу данных добавлено ' + objectsToDatabase.length + ' постов');
                    countPostsFromOneSource += objectsToDatabase.length; // Для отчётности
                    if (objectsToDatabase[objectsToDatabase.length - 1].date < startDate) {
                        dateIsOk = false;
                    }
                }
                else if (content.getLastDate() < startDate) dateIsOk = false;
                countOffset++;
            }
            console.log("Публикации за год из источника " + idCommunity + " собраны!");
            countPosts.push(countPostsFromOneSource); //Для отчётности
        }
        console.log('Количество постов каждого из источника: ' + countPosts);
    }

    async updateDatabase() {
        const { Content } = require('./content.js');
        const content = new Content();
        let countPosts = new Array();
        for (const idCommunity in idsCommunity) { // Обновляем старые данные и собираем новые с одного источника в итерации
            const objects = await this._getAllObjectsFromSameSource(idsCommunity[idCommunity]);
            console.log("Все публикации из источника " + idCommunity + " получены!");
            const newObjects = await content.updateSavedPosts(objects, idsCommunity[idCommunity]);
            console.log("Все публикации из источника " + idCommunity + " обновлены!");
            let lastDate;
            if (newObjects.length != 0) {
                await this._updatePosts(newObjects, idsCommunity[idCommunity]);
                lastDate = newObjects[0].date;
                for (let i = 1; i < newObjects.length; i++)
                    if (lastDate < newObjects[i].date) lastDate = newObjects[i].date;
            }
            else {
                lastDate = objects[0].date;
                for (let i = 1; i < objects.length; i++)
                    if (lastDate < objects[i].date) lastDate = objects[i].date;
            }

            let dateIsOk = true;
            let countOffset = 0;
            const themes = config.get('themes');
            let countPostsFromOneSource = 0; //Для отчётности
            while (dateIsOk) {
                let objectsToDatabase = new Array();
                objectsToDatabase = await content.fullDataCollectionFrom100Posts(idsCommunity[idCommunity], countOffset, themes);
                if (objectsToDatabase.length != 0) {
                    await this.addMany(objectsToDatabase);
                    console.log('В базу данных добавлено ' + objectsToDatabase.length + ' новых постов');
                    countPostsFromOneSource += objectsToDatabase.length; // Для отчётности
                    if (objectsToDatabase[objectsToDatabase.length - 1].date < lastDate) {
                        dateIsOk = false;
                    }
                }
                else if (content.getLastDate() < lastDate) dateIsOk = false;
                countOffset++;
            }
            console.log("Публикации за месяц из источника " + idCommunity + " добавлены!");
            countPosts.push(countPostsFromOneSource); //Для отчётности
        }
        console.log('Количество добавленных постов каждого из источника: ' + countPosts);
    }

    async _updatePosts(newObjects, idCommunity) {
        for (let i = 0; i < newObjects.length; i++) { //Был try catch - проверить
            await this._mongo.collection.update({ id: newObjects[i].id, owner_id: Number.parseInt(idCommunity) }, newObjects[i], { upsert: false });
        }
    }

    async updateArraysWithChartsData(updateObjects, idCommunity) { //НЕЛЬЗЯ ПУШИТЬ МАССИВ В МАССИВ
        for (let i = 0; i < updateObjects.length; i++) {
            await this._mongo.collection.updateOne({ id: updateObjects[i].id, owner_id: Number.parseInt(idCommunity) }, { $push: { morePopular: updateObjects[i].morePopular, activity: updateObjects[i].activity, interest: updateObjects[i].interest, detention: updateObjects[i].detention, dissemination: updateObjects[i].dissemination, averageValues: updateObjects[i].averageValues } }, { upsert: false });
        }
    }

    async clearArraysWithCharstData() {
        const posts = await this._getAllObjects();
        const empty = new Array();
        for (let i = 0; i < posts.length; i++) {
            await this._mongo.collection.updateOne({ id: posts[i].id, owner_id: posts[i].owner_id }, { $set: { morePopular: empty, activity: empty, interest: empty, detention: empty, dissemination: empty, averageValues: empty } }, { upsert: false });
        }
        console.log('Все массивы с данными по графикам очищены у всех объектов!');
    }

    async _getAllObjects() {
        console.log('Запрашиваются все объекты из базы данных...');
        const collection = await this._mongo.collection.find().toArray();
        console.log('Получено ' + collection.length + ' объектов');
        return collection;
    }

    async _getAllObjectsFromSameSource(idCommunity) {
        console.log("Запрашиваются объекты по источнику " + idCommunity + '...');
        const collection = await this._mongo.collection.find({ owner_id: Number.parseInt(idCommunity) }).toArray();
        console.log('Получено ' + collection.length + ' объектов из источника ' + idCommunity);
        return collection;
    }

    async _getLengthAllObjectsFromSource(idSource) { //Нужна для проверки полноты данных
        const collection = await this._mongo.collection.find({ owner_id: idSource }).toArray();
        console.log('Кол-во постов по источнику ' + idSource + ': ' + collection.length);
        let date = collection[0].date;
        for (let i = 1; i < collection.length; i++)
            if (date > collection[i].date) date = collection[i].date;
        console.log('Последняя дата: ' + date);
    }

    async _updateOneTheme(objId, objOwnerId, theme) {
        await this._mongo.collection.update({ id: objId, owner_id: objOwnerId }, { $push: { themes: theme } }, { upsert: false });
    }

    async addMany(objects) {
        await this._mongo.collection.insertMany(objects);
    }

    async addOneObjectOfAnalysis(dayAnalysis, weakAnalysis, monthAnalysis,) {
        const collectionNameDayAnalysis = config.get('collectionNameDayAnalysis');
        const collectionNameWeakAnalysis = config.get('collectionNameWeakAnalysis');
        const collectionNameMonthAnalysis = config.get('collectionNameMonthAnalysis');

        this._mongo = new Mongo(this._dbName, collectionNameDayAnalysis);
        await this._mongo.connect();
        await this._mongo.collection.insertOne(dayAnalysis);
        this._mongo.client.close();

        this._mongo = new Mongo(this._dbName, collectionNameWeakAnalysis);
        await this._mongo.connect();
        await this._mongo.collection.insertOne(weakAnalysis);
        this._mongo.client.close();

        this._mongo = new Mongo(this._dbName, collectionNameMonthAnalysis);
        await this._mongo.connect();
        await this._mongo.collection.insertOne(monthAnalysis);
        this._mongo.client.close();
    }

    async deleteCollection() {
        await this._mongo.collection.drop();
    }

    async deletePost(ownerId, postId) { //Функция удаления поста для администратора/редактора
        await this._mongo.collection.remove({ id: postId, owner_id: ownerId });
    }

    async deletePostsByTheme(numberOfTopic) { //НЕ ПОЛЬЗОВАТЬСЯ! Нумерация тем теряется
        await this._mongo.collection.deleteMany({ themes: numberOfTopic });
        const collection = await _getAllObjects();
        for (let i = 0; i < collection.length; i++) {
            const index = collection[i].themes.indexOf(numberOfTopic);
            if (index > 0) {
                collection[i].themes.splice(index, 1);
                await _updateOne(collection[i].id, collection[i].owner_id, collection[i]);
            }
        }
    }

    async deleteCopyPostsWithoutMetrics() {
        let posts = await this._getAllObjects();
        for (let i = 0; i < posts.length - 1; i++)
            for (let j = i + 1; j < posts.length; j++)
                if (posts[i].owner_id === posts[j].owner_id && posts[i].id === posts[j].id) {
                    posts.splice(j, 1);
                }
        await this._mongo.collection.deleteMany({});
        await this.addMany(posts);
    }

    async addThemes() { //Перед добавлением темы изменить default.json (newThemes прописать в themes, а далее в newThemes прописать нужные ключевые слова) //ДОДЕЛАТЬ И ПРОВЕРИТЬ
        const numberNewTheme = config.get('themes').length + 1;
        const newThemes = config.get('newThemes');
        //Потом вернуть!!!
        //await this.monthlyDataUpdate(); //Перед добавлением обновляем имеющиеся данные
        const collection = await this._getAllObjects();
        for (let i = 0; i < collection.length; i++) {
            for (let j = 0; j < newThemes.length; j++)
                if (collection[i].text.includes(newThemes[j])) {
                    await this._updateOneTheme(collection[i].id, collection[i].owner_id, numberNewTheme + j);
                }
        }
        console.log('Сохранённые публикации обновлены в связи с добавлением новых тем!');
        await this.fullDatabaseFillingForYear(newThemes);
        console.log('Добавлены новые публикации по новым темам!');
    }

    async randomCollection() {
        let objects = await this._getAllObjects();
        console.log('Объекты перемешиваются...');
        let index1, index2;
        let tempObject;
        const length = objects.length - 1;
        for (let i = 0; i < 10000000; i++) {
            index1 = getRandomInt(0, length);
            index2 = getRandomInt(0, length);
            tempObject = objects[index1];
            objects[index1] = objects[index2];
            objects[index2] = tempObject;
        }
        await this._mongo.collection.deleteMany({});
        await this.addMany(objects);
        console.log('Данные в базе данных перемешены!');
    }

    async copyCollection() { //Не понадобиться в обиходе, нужно для переноса бд на сервер
        this.dbConnect();
        let objects = await this._getAllObjects();
        await this._mongo.collection.insertMany(objects);
        console.log('Данные скопированы из коллекции ' + this._collectionName + ' в коллекцию ' + this._mongo._collectionName);
    }

    async deleteFirstAndLastMonday() {
        const firstMonday = config.get('firstMonday');
        const lastMonday = config.get('lastMonday');
        let objects = await this._getAllObjects();
        let newObjects = new Array();
        for (let i = 0; i < objects.length - 1; i++) {
            if (objects[i].date > firstMonday && objects[i].date < lastMonday) {
                newObjects.push(objects[i]);
            }
        }
        await this._mongo.collection.deleteMany({});
        await this.addMany(newObjects);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function example() { //ПРОВЕРИТЬ ПОВТОРЯЮЩИЕСЯ ПУБЛИКАЦИИ ПО АЙДИШНИКАМ
    const database = new Database();
    await database.dbConnect();
    console.log('Подключились к бд!');

    await database.deleteCopyPostsWithoutMetrics();

    await database.randomCollection();

    // await database.deleteFirstAndLastMonday();
    // console.log('Данные до первого понедельника и после последнего удалены');

    // await database.updateDatabase();
    // console.log("Данные за месяц обновились! Кчау シ");

    //await database.addThemes(); //ДОРАБОТАТЬ

    // const themes = config.get('themes');
    // await database.fullDatabaseFillingForYear(themes);
    // console.log('Публикации за год собраны!');

    // await database.copyCollection('collectionThemesCopy');
    // await database.randomCollection();

    // const idsCommunity = await config.get("idsCommunity");
    // for (const idCommunity in idsCommunity)
    //     await database._getLengthAllObjectsFromSource(Number.parseInt(idsCommunity[idCommunity]));
    database._mongo.client.close();
}
// example();

module.exports = { Database };
