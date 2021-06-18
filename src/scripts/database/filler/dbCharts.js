const config = require('config');

class ContentCharts {
    _database;
    _averageActivity = 0;
    _averageInterest = 0;
    _averageDetention = 0;
    _averageDissemination = 0;

    async connectToDatabase() { //Необходимо вызвать сразу после создания объекта класса
        const { Database } = require('./dbInteraction.js');
        this._database = new Database();
        await this._database.dbConnect();
        console.log('Подключились к бд!');
    }

    async getAllDataForCharts() {
        const idsCommunity = config.get('idsCommunity');
        const themes = config.get('themes');
        await this._database.clearArraysWithCharstData();
        for (const idCommunity in idsCommunity) {
            const collection = await this._database._getAllObjectsFromSameSource(idsCommunity[idCommunity]);
            console.log('Высчитываются метрики для графиков по каждой из тем в источнике ' + idCommunity + '...');
            for (let i = 0; i < themes.length; i++) {
                let posts = new Array();
                for (let j = 0; j < collection.length; j++) if (collection[j].themes.indexOf(i + 1) != -1) posts.push(collection[j]); //Собираем массив постов по 1 теме из 1 источника
                this._averageActivity = 0;
                this._averageInterest = 0;
                this._averageDetention = 0;
                this._averageDissemination = 0;
                posts = await this.sortInAscendingOrder(posts);
                posts = await this.getPopularityOfEachPost(posts);
                posts = await this.getActivityAndDetentionOfEachPost(posts);
                posts = await this.getDisseminationOfEachPost(posts);
                posts = await this.getAverageValues(posts);
                posts = await this._database.updateArraysWithChartsData(posts, idsCommunity[idCommunity]);
                console.log("Все публикации из источника " + idCommunity + " по теме " + (i + 1) + " обновлены!");
            }
        }
    }

    async sortInAscendingOrder(posts) {
        let object;
        for (let i = 0; i < posts.length - 1; i++) {
            for (let j = 0; j < posts.length - i - 1; j++) {
                if (posts[j].date > posts[j + 1].date) {
                    object = posts[j];
                    posts[j] = posts[j + 1];
                    posts[j + 1] = object;
                }
            }
        }
        return posts;
    }

    async getPopularityOfEachPost(posts) {
        let countPopularity = 0;
        //Отдельно обрабатываем 1й и последний посты, т.к. они имеют только одного соседа
        if (posts[0].likes > posts[1].likes) ++countPopularity;
        if (posts[0].comments_count > posts[1].comments_count) ++countPopularity;
        if (posts[0].reposts > posts[1].reposts) ++countPopularity;
        if (posts[0].views > posts[1].views) ++countPopularity;

        if (countPopularity > 2) posts[0].morePopular = true;
        else if (countPopularity <= 2) posts[0].morePopular = false;
        countPopularity = 0;

        if (posts[posts.length - 1].likes > posts[posts.length - 2].likes) ++countPopularity;
        if (posts[posts.length - 1].comments_count > posts[posts.length - 2].comments_count) ++countPopularity;
        if (posts[posts.length - 1].reposts > posts[posts.length - 2].reposts) ++countPopularity;
        if (posts[posts.length - 1].views > posts[posts.length - 2].views) ++countPopularity;

        if (countPopularity > 2) posts[posts.length - 1].morePopular = true;
        else if (countPopularity <= 2) posts[posts.length - 1].morePopular = false;
        //Обрабатываем все остальные посты
        for (let i = 1; i < posts.length - 1; i++) {
            countPopularity = 0;

            if ((posts[i].likes > posts[i - 1].likes) && (posts[i].likes > posts[i + 1].likes)) ++countPopularity;
            if ((posts[i].comments_count > posts[i - 1].comments_count) && (posts[i].comments_count > posts[i + 1].comments_count)) ++countPopularity;
            if ((posts[i].reposts > posts[i - 1].reposts) && (posts[i].reposts > posts[i + 1].reposts)) ++countPopularity;
            if ((posts[i].views > posts[i - 1].views) && (posts[i].views > posts[i + 1].views)) ++countPopularity;

            if (countPopularity >= 2) posts[i].morePopular = true;
            else if (countPopularity < 2) posts[i].morePopular = false;
        }
        return posts;
    }

    async getActivityAndDetentionOfEachPost(posts) {
        for (let i = 0; i < posts.length; i++) {
            posts[i].activity = new Array();
            posts[i].interest = new Array();
            posts[i].activity.push(0);
            posts[i].interest.push(0);
            const activity = +((posts[i].likes / posts[i].views) * 1000).toFixed(3);
            this._averageActivity += activity;
            const interest = +((posts[i].comments_count / posts[i].views) * 1000).toFixed(3);
            this._averageInterest += interest;
            posts[i].activity.push(activity);
            posts[i].interest.push(interest);
        }

        posts[0].activity[0] = posts[1].activity[1];
        posts[posts.length - 1].activity[0] = posts[posts.length - 2].activity[1];
        posts[0].interest[0] = posts[1].interest[1];
        posts[posts.length - 1].interest[0] = posts[posts.length - 2].interest[1];

        for (let i = 1; i < posts.length - 1; i++) {
            posts[i].activity[0] = posts[i - 1].activity[1];
            posts[i].activity.push(posts[i + 1].activity[1]);
            posts[i].interest[0] = posts[i - 1].interest[1];
            posts[i].interest.push(posts[i + 1].interest[1]);
        }

        for (let i = 0; i < posts.length; i++) {
            const detention = +(posts[i].comments_count / posts[i].likes).toFixed(3);
            posts[i].detention = detention;
            this._averageDetention += detention;
        }
        return posts;
    }

    async getDisseminationOfEachPost(posts) {
        for (let i = 0; i < posts.length; i++) {
            posts[i].dissemination = new Array();
            posts[i].dissemination.push(0);
            const dissemination = +(posts[i].reposts / posts[i].views * 1000).toFixed(3);
            this._averageDissemination += dissemination;
            posts[i].dissemination.push(dissemination);
        }

        posts[0].dissemination[0] = posts[1].dissemination[1];
        posts[posts.length - 1].dissemination[0] = posts[posts.length - 2].dissemination[1];

        for (let i = 1; i < posts.length - 1; i++) {
            posts[i].dissemination[0] = posts[i - 1].dissemination[1];
            posts[i].dissemination.push(posts[i + 1].dissemination[1]);
        }
        return posts;
    }

    async getAverageValues(posts) {
        const averageActivity = +(this._averageActivity / posts.length).toFixed(3);
        const averageInterest = +(this._averageInterest / posts.length).toFixed(3);
        const averageDetention = +(this._averageDetention / posts.length).toFixed(3);
        const averageDissemination = +(this._averageDissemination / posts.length).toFixed(3);
        for (let i = 0; i < posts.length; i++) {
            posts[i].averageValues = new Array();
            posts[i].averageValues.push(averageActivity);
            posts[i].averageValues.push(averageInterest);
            posts[i].averageValues.push(averageDetention);
            posts[i].averageValues.push(averageDissemination);
        }
        return posts;
    }
}

async function example() {
    const charts = new ContentCharts();
    await charts.connectToDatabase();
    await charts.getAllDataForCharts();
    charts._database._mongo.client.close();
}
example();

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = { ContentCharts };