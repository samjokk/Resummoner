const config = require('config');
const fs = require('fs');

class ContentAnalysis {
    _database;

    async connectToDatabase() { //Необходимо вызвать сразу после создания объекта класса
        const { Database } = require('./dbInteraction.js');
        this._database = new Database();
        await this._database.dbConnect();
        console.log('Подключились к бд!');
    }

    async getAnalysisOfAllDays() {
        const themes = config.get('themes');
        const idsCommunity = config.get('idsCommunity');
        const fileDays = JSON.parse(fs.readFileSync('./src/scripts/database/filler/datesAnalysis/days.json', 'utf8'));
        const fileWeaks = JSON.parse(fs.readFileSync('./src/scripts/database/filler/datesAnalysis/weaks.json', 'utf8'));
        const fileMonths = JSON.parse(fs.readFileSync('./src/scripts/database/filler/datesAnalysis/months.json', 'utf8'));
        let objectDays = new Object();
        let objectWeaks = new Object();
        let objectMonths = new Object();

        let arrayThemesByDay = new Array();
        let arrayThemesByWeak = new Array();
        let arrayThemesByMonth = new Array();
        for (let indexTheme = 1; indexTheme <= themes.length; indexTheme++) {
            let valuesDay = new Array();
            let valuesWeak = new Array();
            let valuesMonth = new Array();
            for (let i = 1; i < fileDays.dates.length; i++) valuesDay.push(new Array());
            for (let i = 1; i < fileWeaks.dates.length; i++) valuesWeak.push(new Array());
            for (let i = 1; i < fileMonths.dates.length; i++) valuesMonth.push(new Array());
            let resummoner;
            for (const idCommunity in idsCommunity) {

                let collection = await this._database._getAllObjectsFromSameSource(idsCommunity[idCommunity]);
                console.log('Высчитываются метрики для общего анализа по теме ' + indexTheme + ' в источнике ' + idCommunity + '...');
                collection = await this.sortByTopic(collection, indexTheme);
                console.log('После сортировки по теме ' + indexTheme + ' в источнике ' + idCommunity + ' осталось ' + collection.length + ' объектов');

                for (let i = 1; i < fileDays.dates.length; i++) { //Проходим каждый из дней, добавляя 1 значение по источнику
                    let postsForDay = new Array();
                    for (let j = 0; j < collection.length; j++) {
                        if ((collection[j].date >= fileDays.dates[i - 1]) && (collection[j].date < fileDays.dates[i])) {
                            postsForDay.push(collection[j]);
                        }
                    }
                    if (postsForDay.length != 0) {
                        resummoner = await this.getResummoner(postsForDay);
                        valuesDay[i - 1].push(resummoner);
                    }
                    else valuesDay[i - 1].push(0);
                }

                for (let i = 1; i < fileWeaks.dates.length; i++) {
                    let valueForWeak = 0;
                    for (let j = (i - 1) * 7; j < i * 7; j++) {
                        valueForWeak += valuesDay[j][valuesDay[j].length - 1];
                    }
                    valueForWeak /= 7;
                    valueForWeak = +(valueForWeak.toFixed(3));
                    valuesWeak[i - 1].push(valueForWeak);
                }

                for (let i = 1; i < fileMonths.dates.length; i++) {
                    let postsForMonth = new Array();
                    for (let j = 0; j < collection.length; j++) {
                        if ((collection[j].date >= fileMonths.dates[i - 1]) && (collection[j].date < fileMonths.dates[i])) {
                            postsForMonth.push(collection[j]);
                        }
                    }
                    if (postsForMonth.length != 0) {
                        resummoner = await this.getResummoner(postsForMonth);
                        valuesMonth[i - 1].push(resummoner);
                    }
                    else {
                        valuesMonth[i - 1].push(0);
                    }
                }
            }
            arrayThemesByDay.push(valuesDay);
            arrayThemesByWeak.push(valuesWeak);
            arrayThemesByMonth.push(valuesMonth);
        }
        objectDays.analysis = arrayThemesByDay;
        objectWeaks.analysis = arrayThemesByWeak;
        objectMonths.analysis = arrayThemesByMonth;
        await this._database.addOneObjectOfAnalysis(objectDays, objectWeaks, objectMonths);
    }

    async sortByTopic(posts, theme) {
        let newPosts = new Array();
        for (let i = 0; i < posts.length; i++)
            if (posts[i].themes.includes(theme))
                newPosts.push(posts[i]);
        return newPosts;
    }

    async getResummoner(posts) {
        let resummoner = 0;
        for (let i = 0; i < posts.length; i++) {
            resummoner += ((posts[i].likes + posts[i].comments_count * 2 + posts[i].reposts * 3) / (posts[i].views / 1000));
        }
        return +(resummoner / posts.length).toFixed(3);
    }

    calculateAllDayDates() {
        const lastMonday = config.get('lastMonday');
        const dayUnixTime = config.get('dayUnixTime');
        let day = config.get('firstMonday');
        const path = './src/scripts/database/filler/datesAnalysis/days.json';
        let dayDates = new Array();
        while (day <= lastMonday) {
            dayDates.push(day);
            day += dayUnixTime;
        }
        let object = new Object();
        object.dates = dayDates;
        writeJsonFile(path, object);
    }

    calculateAllWeakDates() {
        const lastMonday = config.get('lastMonday');
        const weakUnixTime = config.get('weakUnixTime');
        let weak = config.get('firstMonday');
        const path = './src/scripts/database/filler/datesAnalysis/weaks.json';
        let weakDates = new Array();
        while (weak <= lastMonday) {
            weakDates.push(weak);
            weak += weakUnixTime;
        }
        let object = new Object();
        object.dates = weakDates;
        writeJsonFile(path, object);
    }
}

function writeJsonFile(path, object) {
    fs.writeFile(path, JSON.stringify(object, null, 1), (err) => {
        if (err) console.log(err);
        else console.log('Файл ' + path + ' создан!');
    });
}

async function example() {
    const analysis = new ContentAnalysis();
    await analysis.connectToDatabase();
    await analysis.getAnalysisOfAllDays();

    // await analysis.calculateAllDayDates();
    // await analysis.calculateAllWeakDates();
    // analysis._database._mongo.client.close();
}
example();

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = { ContentAnalysis };